import { getUserService, updateUserService, deleteUserService } from '../services/userService.js';

export const getUser = async (req, res, next) => {
  try {
    const user = await getUserService(req.user.id);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Execution Successful.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await updateUserService(req.user.id, req.body);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Execution Successful.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await deleteUserService(req.user.id);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Execution Successful.",
    });
  } catch (error) {
    next(error);
  }
};
