const registerUser = async (req, res) => {
  try {
    res.status(200).json({
      message: "Register controller working",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { registerUser };