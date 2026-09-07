const SKILLS = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "Express",
  "Java",
  "Spring Boot",
  "Python",
  "Flask",
  "Django",
  "PHP",
  "MySQL",
  "MongoDB",
  "PostgreSQL",
  "SQL",
  "Machine Learning",
  "Deep Learning",
  "Artificial Intelligence",
  "NLP",
  "Data Science",
  "TensorFlow",
  "PyTorch",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "Git",
  "GitHub",
  "Figma",
  "UI",
  "UX",
  "Selenium",
  "Testing",
  "Automation",
  "n8n",
  "C",
  "C++",
  "C#",
];


const normalize = (text = "") => {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
};


const aliases = {
  javascript: [
    "javascript",
    "java script",
    "js",
  ],

  typescript: [
    "typescript",
    "type script",
    "ts",
  ],

  react: [
    "react",
    "reactjs",
    "react.js",
  ],

  angular: [
    "angular",
    "angularjs",
  ],

  vue: [
    "vue",
    "vuejs",
    "vue.js",
  ],

  "node.js": [
    "node.js",
    "nodejs",
    "node js",
  ],

  express: [
    "express",
    "expressjs",
    "express.js",
  ],

  mongodb: [
    "mongodb",
    "mongo db",
    "mongo",
  ],

  mysql: [
    "mysql",
    "my sql",
  ],

  postgresql: [
    "postgresql",
    "postgres",
    "postgre sql",
  ],

  "spring boot": [
    "spring boot",
    "springboot",
  ],

  "machine learning": [
    "machine learning",
    "ml",
  ],

  "deep learning": [
    "deep learning",
    "dl",
  ],

  "artificial intelligence": [
    "artificial intelligence",
    "ai",
  ],

  nlp: [
    "nlp",
    "natural language processing",
  ],

  "data science": [
    "data science",
    "data scientist",
  ],

  tensorflow: [
    "tensorflow",
    "tensor flow",
  ],

  pytorch: [
    "pytorch",
    "py torch",
  ],

  github: [
    "github",
    "git hub",
  ],

  selenium: [
    "selenium",
  ],

  n8n: [
    "n8n",
  ],

  "c++": [
    "c++",
  ],

  "c#": [
    "c#",
    "c sharp",
  ],
};


const containsPhrase = (
  text,
  phrase
) => {
  const normalizedPhrase =
    normalize(phrase);

  const escaped =
    normalizedPhrase.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

  const regex =
    new RegExp(
      `(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`,
      "i"
    );

  return regex.test(text);
};


// ======================================================
// EXTRACT SKILLS FROM TEXT / RESUME
// ======================================================

const extractSkills = (
  resumeText = ""
) => {
  const text =
    normalize(resumeText);

  const foundSkills = [];

  SKILLS.forEach((skill) => {
    const key =
      skill.toLowerCase();

    const possibleNames =
      aliases[key] || [key];

    const found =
      possibleNames.some(
        (name) =>
          containsPhrase(
            text,
            name
          )
      );

    if (found) {
      foundSkills.push(
        skill
      );
    }
  });

  return [
    ...new Set(
      foundSkills
    ),
  ];
};


// ======================================================
// SPECIALIZATIONS
// ======================================================

const SPECIALIZATIONS = [
  {
    name:
      "Frontend Developer",

    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Angular",
      "Vue",
    ],
  },

  {
    name:
      "Backend Developer",

    skills: [
      "Node.js",
      "Express",
      "Java",
      "Spring Boot",
      "Python",
      "Flask",
      "Django",
      "PHP",
    ],
  },

  {
    name:
      "Full Stack Developer",

    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "MySQL",
      "SQL",
    ],
  },

  {
    name:
      "AI / ML Engineer",

    skills: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "Artificial Intelligence",
      "NLP",
      "TensorFlow",
      "PyTorch",
    ],
  },

  {
    name:
      "Data Scientist",

    skills: [
      "Python",
      "Data Science",
      "Machine Learning",
      "SQL",
      "TensorFlow",
      "PyTorch",
    ],
  },

  {
    name:
      "Database Developer",

    skills: [
      "MySQL",
      "MongoDB",
      "PostgreSQL",
      "SQL",
    ],
  },

  {
    name:
      "DevOps / Cloud Engineer",

    skills: [
      "AWS",
      "Azure",
      "Docker",
      "Kubernetes",
      "Git",
      "GitHub",
    ],
  },

  {
    name:
      "UI / UX Designer",

    skills: [
      "Figma",
      "UI",
      "UX",
      "CSS",
    ],
  },

  {
    name:
      "QA / Automation Engineer",

    skills: [
      "Selenium",
      "Testing",
      "Automation",
    ],
  },
];


// ======================================================
// DETECT SPECIALIZATION
// ======================================================

const detectSpecialization = (
  skills = []
) => {
  if (
    !Array.isArray(skills) ||
    skills.length === 0
  ) {
    return "Software Developer";
  }

  const userSkills =
    skills.map(
      (skill) =>
        normalize(skill)
    );

  let best =
    "Software Developer";

  let highestScore = 0;

  SPECIALIZATIONS.forEach(
    (specialization) => {
      const matches =
        specialization.skills.filter(
          (skill) =>
            userSkills.includes(
              normalize(skill)
            )
        ).length;

      const score =
        matches /
        specialization.skills.length;

      if (
        score >
        highestScore
      ) {
        highestScore =
          score;

        best =
          specialization.name;
      }
    }
  );

  return best;
};


// ======================================================
// DETECT EXPERIENCE
// ======================================================

const detectExperience = (
  resumeText = ""
) => {
  const text =
    normalize(resumeText);

  const patterns = [
    /(\d+(?:\.\d+)?)\+?\s*years?\s+(?:of\s+)?experience/g,

    /experience\s*(?:of)?\s*(\d+(?:\.\d+)?)\+?\s*years?/g,

    /(\d+(?:\.\d+)?)\+?\s*yrs?\s+(?:of\s+)?experience/g,

    /(\d+(?:\.\d+)?)\+?\s*years?\s+in\s+/g,
  ];

  const detected = [];

  patterns.forEach(
    (pattern) => {
      let match;

      while (
        (
          match =
            pattern.exec(text)
        ) !== null
      ) {
        const years =
          Number(
            match[1]
          );

        if (
          Number.isFinite(
            years
          )
        ) {
          detected.push(
            years
          );
        }
      }
    }
  );

  if (
    detected.length === 0
  ) {
    return 0;
  }

  return Math.max(
    ...detected
  );
};


// ======================================================
// ANALYZE RESUME
// ======================================================

const analyzeResume = (
  resumeText
) => {
  const skills =
    extractSkills(
      resumeText
    );

  const specialization =
    detectSpecialization(
      skills
    );

  const experienceYears =
    detectExperience(
      resumeText
    );

  return {
    skills,
    specialization,
    experienceYears,
  };
};


// ======================================================
// TASK KEYWORD MAPPING
// ======================================================

const TASK_KEYWORD_SKILLS = [
  {
    keywords: [
      "frontend",
      "front end",
      "web page",
      "webpage",
      "website",
      "landing page",
      "login page",
      "register page",
      "registration page",
      "signup page",
      "dashboard",
      "responsive page",
      "responsive design",
    ],

    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
    ],
  },

  {
    keywords: [
      "backend",
      "back end",
      "server",
      "api",
      "rest api",
      "authentication",
      "authorization",
      "jwt",
      "server side",
    ],

    skills: [
      "Node.js",
      "Express",
    ],
  },

  {
    keywords: [
      "database",
      "data storage",
      "schema",
      "collection",
      "query",
      "queries",
    ],

    skills: [
      "MongoDB",
      "MySQL",
      "SQL",
    ],
  },

  {
    keywords: [
      "ai",
      "artificial intelligence",
      "intelligent recommendation",
      "recommendation system",
      "prediction",
    ],

    skills: [
      "Artificial Intelligence",
      "Python",
    ],
  },

  {
    keywords: [
      "machine learning",
      "ml model",
      "classification",
      "regression",
      "training model",
      "prediction model",
    ],

    skills: [
      "Python",
      "Machine Learning",
    ],
  },

  {
    keywords: [
      "deep learning",
      "neural network",
      "cnn",
      "rnn",
    ],

    skills: [
      "Python",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
    ],
  },

  {
    keywords: [
      "natural language",
      "nlp",
      "text analysis",
      "sentiment analysis",
      "chatbot",
    ],

    skills: [
      "Python",
      "NLP",
    ],
  },

  {
    keywords: [
      "data science",
      "data analysis",
      "data analytics",
      "dataset",
      "visualization",
    ],

    skills: [
      "Python",
      "Data Science",
      "SQL",
    ],
  },

  {
    keywords: [
      "ui design",
      "ux design",
      "prototype",
      "wireframe",
      "mockup",
      "figma",
    ],

    skills: [
      "Figma",
      "UI",
      "UX",
    ],
  },

  {
    keywords: [
      "testing",
      "automation testing",
      "test case",
      "quality assurance",
      "qa",
    ],

    skills: [
      "Testing",
      "Selenium",
      "Automation",
    ],
  },

  {
    keywords: [
      "deployment",
      "deploy",
      "cloud",
      "container",
      "devops",
      "ci/cd",
    ],

    skills: [
      "Git",
      "GitHub",
      "Docker",
      "AWS",
    ],
  },

  {
    keywords: [
      "workflow automation",
      "automation workflow",
      "workflow",
    ],

    skills: [
      "Automation",
      "n8n",
    ],
  },
];


// ======================================================
// EXTRACT REQUIRED SKILLS FROM TASK
// ======================================================

const extractTaskSkills = (
  task = {}
) => {
  const taskText =
    normalize(
      `${
        task.title || ""
      } ${
        task.description || ""
      }`
    );

  const directSkills =
    extractSkills(
      taskText
    );

  const inferredSkills =
    [];

  TASK_KEYWORD_SKILLS.forEach(
    ({
      keywords,
      skills,
    }) => {
      const matched =
        keywords.some(
          (keyword) =>
            containsPhrase(
              taskText,
              keyword
            )
        );

      if (matched) {
        inferredSkills.push(
          ...skills
        );
      }
    }
  );

  return [
    ...new Set([
      ...directSkills,
      ...inferredSkills,
    ]),
  ];
};


// ======================================================
// DETECT TASK SPECIALIZATION
// ======================================================

const detectTaskSpecialization =
  (task = {}) => {
    const requiredSkills =
      extractTaskSkills(
        task
      );

    return detectSpecialization(
      requiredSkills
    );
  };


// ======================================================
// SCORE CANDIDATE
// ======================================================

const scoreCandidate = (
  candidate,
  task
) => {
  const requiredSkills =
    extractTaskSkills(
      task
    );

  const candidateSkills =
    Array.isArray(
      candidate.skills
    )
      ? candidate.skills.map(
          (skill) =>
            normalize(skill)
        )
      : [];


  // ----------------------------------------------------
  // MATCHED SKILLS
  // ----------------------------------------------------

  const matchedSkills =
    requiredSkills.filter(
      (skill) =>
        candidateSkills.includes(
          normalize(skill)
        )
    );


  // ----------------------------------------------------
  // SKILL SCORE - MAX 60
  // ----------------------------------------------------

  let skillScore = 0;

  if (
    requiredSkills.length > 0
  ) {
    skillScore =
      Math.round(
        (
          matchedSkills.length /
          requiredSkills.length
        ) * 60
      );
  }


  // ----------------------------------------------------
  // EXPERIENCE SCORE - MAX 10
  // ----------------------------------------------------

  const experience =
    Number(
      candidate.experience_years
    ) || 0;

  const experienceScore =
    Math.min(
      experience * 2,
      10
    );


  // ----------------------------------------------------
  // SPECIALIZATION SCORE - MAX 20
  // ----------------------------------------------------

  const candidateSpecialization =
    normalize(
      candidate.specialization ||
        ""
    );

  const taskSpecialization =
    normalize(
      detectTaskSpecialization(
        task
      )
    );

  let specializationScore =
    0;

  if (
    candidateSpecialization &&
    taskSpecialization
  ) {
    if (
      candidateSpecialization ===
      taskSpecialization
    ) {
      specializationScore =
        20;
    } else if (
      candidateSpecialization.includes(
        "full stack"
      ) &&
      (
        taskSpecialization.includes(
          "frontend"
        ) ||
        taskSpecialization.includes(
          "backend"
        )
      )
    ) {
      specializationScore =
        18;
    } else if (
      candidateSpecialization.includes(
        "ai"
      ) &&
      (
        taskSpecialization.includes(
          "ai"
        ) ||
        taskSpecialization.includes(
          "data scientist"
        )
      )
    ) {
      specializationScore =
        18;
    } else if (
      candidateSpecialization.includes(
        "data scientist"
      ) &&
      taskSpecialization.includes(
        "ai"
      )
    ) {
      specializationScore =
        15;
    }
  }


  // ----------------------------------------------------
  // AVAILABILITY / WORKLOAD SCORE - MAX 10
  // ----------------------------------------------------

  const activeTasks =
    Number(
      candidate.active_tasks
    ) || 0;

  let workloadScore = 10;

  if (activeTasks === 0) {
    workloadScore = 10;
  } else if (
    activeTasks === 1
  ) {
    workloadScore = 8;
  } else if (
    activeTasks === 2
  ) {
    workloadScore = 6;
  } else if (
    activeTasks === 3
  ) {
    workloadScore = 4;
  } else if (
    activeTasks === 4
  ) {
    workloadScore = 2;
  } else {
    workloadScore = 0;
  }


  // ----------------------------------------------------
  // FINAL SCORE
  // ----------------------------------------------------

  const finalScore =
    Math.max(
      0,
      Math.min(
        100,
        skillScore +
          specializationScore +
          experienceScore +
          workloadScore
      )
    );


  // ----------------------------------------------------
  // REASON
  // ----------------------------------------------------

  let reason = "";

  if (
    matchedSkills.length > 0
  ) {
    reason +=
      `Matched ${matchedSkills.length} of ${requiredSkills.length} required skills`;

    reason +=
      ` (${matchedSkills.join(", ")}). `;
  } else if (
    requiredSkills.length > 0
  ) {
    reason +=
      `No direct skill matches found from ${requiredSkills.length} detected task skills. `;
  } else {
    reason +=
      "No specific technical skills were detected from the task description. ";
  }


  if (
    specializationScore > 0
  ) {
    reason +=
      `${
        candidate.specialization ||
        "Candidate"
      } specialization is relevant to this task. `;
  }


  if (experience > 0) {
    reason +=
      `${experience} year(s) of experience. `;
  } else {
    reason +=
      "No professional experience detected. ";
  }


  if (
    activeTasks === 0
  ) {
    reason +=
      "Currently has no active tasks, providing high availability.";
  } else if (
    activeTasks <= 2
  ) {
    reason +=
      `Currently handling ${activeTasks} active task(s), indicating good availability.`;
  } else {
    reason +=
      `Currently handling ${activeTasks} active task(s), so workload reduced the recommendation score.`;
  }


  return {
    score:
      Math.round(
        finalScore
      ),

    matchedSkills,

    requiredSkills,

    specializationScore,

    skillScore,

    experienceScore,

    workloadScore,

    reason,
  };
};


module.exports = {
  normalize,
  extractSkills,
  detectSpecialization,
  detectExperience,
  analyzeResume,
  extractTaskSkills,
  detectTaskSpecialization,
  scoreCandidate,
};