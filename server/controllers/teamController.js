const fs =
  require("fs");

const path =
  require("path");

const pdfParse =
  require("pdf-parse");

const mammoth =
  require("mammoth");

const {
  getTeam,
  getCandidates,
  updateResumeProfile,
} =
  require("../models/teamModel");

const {
  analyzeResume,
  scoreCandidate,
} =
  require("../services/intelligenceService");

const fetchTeam = async (
  req,
  res
) => {
  try {
    const members =
      await getTeam();

    return res
      .status(200)
      .json(members);
  } catch (error) {
    console.error(
      "FETCH TEAM ERROR:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to fetch team",
        error:
          error.message,
      });
  }
};

const extractText = async (
  file
) => {
  const extension =
    path
      .extname(
        file.originalname
      )
      .toLowerCase();

  if (
    extension === ".pdf"
  ) {
    const buffer =
      fs.readFileSync(
        file.path
      );

    const result =
      await pdfParse(
        buffer
      );

    return result.text || "";
  }

  if (
    extension === ".docx"
  ) {
    const result =
      await mammoth.extractRawText(
        {
          path:
            file.path,
        }
      );

    return result.value || "";
  }

  if (
    extension === ".txt"
  ) {
    return fs.readFileSync(
      file.path,
      "utf8"
    );
  }

  throw new Error(
    "Unsupported resume format"
  );
};

const uploadResume = async (
  req,
  res
) => {
  let uploadedPath = null;

  try {
    const { userId } =
      req.params;

    if (
      req.user.id !==
        userId &&
      req.user.role !==
        "Admin"
    ) {
      return res
        .status(403)
        .json({
          message:
            "You can only upload your own resume",
        });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({
          message:
            "Please select a resume file",
        });
    }

    uploadedPath =
      req.file.path;

    const resumeText =
      await extractText(
        req.file
      );

    if (
      !resumeText ||
      !resumeText.trim()
    ) {
      return res
        .status(400)
        .json({
          message:
            "No readable text found in resume",
        });
    }

    const analysis =
      analyzeResume(
        resumeText
      );

    const updatedUser =
      await updateResumeProfile(
        userId,
        {
          skills:
            analysis.skills,

          specialization:
            analysis.specialization,

          experienceYears:
            analysis.experienceYears,

          fileName:
            req.file
              .originalname,

          resumeText,
        }
      );

    if (!updatedUser) {
      return res
        .status(404)
        .json({
          message:
            "User not found",
        });
    }

    return res
      .status(200)
      .json({
        message:
          "Resume analyzed successfully",

        analysis: {
          skills:
            analysis.skills,

          specialization:
            analysis.specialization,

          experience_years:
            analysis.experienceYears,

          resume_file_name:
            req.file
              .originalname,
        },
      });
  } catch (error) {
    console.error(
      "RESUME ERROR:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          error.message ||
          "Resume analysis failed",
      });
  } finally {
    if (
      uploadedPath &&
      fs.existsSync(
        uploadedPath
      )
    ) {
      try {
        fs.unlinkSync(
          uploadedPath
        );
      } catch (
        cleanupError
      ) {
        console.error(
          "Resume cleanup error:",
          cleanupError
        );
      }
    }
  }
};

const suggestMembers =
  async (
    req,
    res
  ) => {
    try {
      const {
        title,
        description,
      } = req.body;

      if (!title) {
        return res
          .status(400)
          .json({
            message:
              "Task title is required",
          });
      }

      const candidates =
        await getCandidates();

      const ranked =
        candidates
          .map(
            (candidate) => {
              const result =
                scoreCandidate(
                  candidate,
                  {
                    title,
                    description,
                  }
                );

              return {
                ...candidate,
                assignment_score:
                  result.score,

                matched_skills:
                  result.matchedSkills,

                assignment_reason:
                  result.reason,
              };
            }
          )
          .sort(
            (a, b) =>
              b.assignment_score -
              a.assignment_score
          );

      return res
        .status(200)
        .json({
          suggestions:
            ranked,
        });
    } catch (error) {
      console.error(
        "SUGGEST MEMBERS ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Unable to generate suggestions",
        });
    }
  };

module.exports = {
  fetchTeam,
  uploadResume,
  suggestMembers,
};