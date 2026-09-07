const User =
  require("../models/userModel");

const searchUsers = async (
  req,
  res
) => {
  try {
    const search =
      req.query.search?.trim() ||
      "";

    const query =
      search
        ? {
            $or: [
              {
                full_name: {
                  $regex: search,
                  $options: "i",
                },
              },
              {
                email: {
                  $regex: search,
                  $options: "i",
                },
              },
            ],
          }
        : {};

    const users =
      await User.find(query)
        .select(
          "full_name email role skills specialization experience_years"
        )
        .sort({
          full_name: 1,
        })
        .limit(20);

    return res
      .status(200)
      .json(users);
  } catch (error) {
    console.error(
      "Search users error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to search users",
      });
  }
};

module.exports = {
  searchUsers,
};