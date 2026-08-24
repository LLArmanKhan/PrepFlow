import goalModel from "../models/goal.model.js";
import userModel from "../models/user.model.js";

export async function createGoal(req, res) {
  // status will be provided by frontend

  const {
    title,
    description,
    unit,
    currentValue,
    targetValue,
    targetDate,
    status,
  } = req.body;

  let goal = null;
  if (status == "Active") {
    goal = await goalModel.create({
      userId: req.userId,
      title,
      description,
      unit,
      currentValue,
      targetValue,
      targetDate,
      status,
    });
  } else if (status == "Completed") {
    goal = await goalModel.create({
      userId: req.userId,
      title,
      description,
      unit,
      currentValue,
      targetValue: currentValue,
      targetDate,
      status,
    });
  } else {
    return res.status(400).json({
      message: "Invalid Goal Scope",
    });
  }

  res.status(200).json({
    message: "Goal Created Successfully",
    Goal: {
      title: goal.title,
      description: goal.description,
      unit: goal.unit,
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      targetDate: goal.targetDate,
      status: goal.status,
    },
  });
}

// API FOR UPDATING GOALS AUTOMATICALLY IF THERE IS A NEW PROGRESS
export async function updateGoal(req, res) {

  const {
    title,
    description,
    unit,
    currentValue,
    targetValue,
    targetDate,
    status,
    goalId,
  } = req.body;

  const updateData = {};

  // will configure frontend aise ki agar user ne click kiya "mark as completed"
  // to currentval ki value will be equal to targetval

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (unit !== undefined) updateData.unit = unit;
  if (currentValue !== undefined) updateData.currentValue = currentValue;
  if (targetValue !== undefined) updateData.targetValue = targetValue;
  if (targetDate !== undefined) updateData.targetDate = targetDate;
  if (status !== undefined) updateData.status = status;

  const goal = await goalModel.findOneAndUpdate(
    { _id: goalId, userId: req.userId },
    { $set: updateData },
    { new: true },
  );

  if (!goal) {
    return res.status(404).json({
      message: "Goal Not Found",
    });
  }

  if (status == "Completed") {
    goal.currentValue = goal.targetValue;
    await goal.save();
  }

  res.status(200).json({
    message: "Goal Updated Successfully",
    Goal: {
      title: goal.title,
      description: goal.description,
      unit: goal.unit,
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      targetDate: goal.targetDate,
      status: goal.status,
    },
  });
}

export async function getGoal(req, res) {

  const { goalId } = req.body;

  const goal = await goalModel.findOne({
    _id: goalId,
    userId: req.userId,
  });

  if (!goal) {
    return res.status(404).json({
      message: "Goal Not Found",
    });
  }

  res.status(200).json({
    message: "Goal Fetched Successfully",
    goal,
  });
}

export async function getGoals(req,res) {

  const goals = await goalModel.find({
    userId: req.userId,
  });

  res.status(200).json({
    message:"Goals Fetched Successfully",
    goals
  })
}

export async function deleteGoal(req,res) {

  const { goalId } = req.body;

  const goal = await goalModel.findOneAndDelete({
    _id: goalId,
    userId: req.userId,
  });

  if (!goal) {
    return res.status(404).json({
      message: "Goal Not Found",
    });
  }

  res.status(200).json({
    message:"Goal Deleted Successfully"
  })
}

export async function deleteGoals(req,res) {

  const goals = await goalModel.deleteMany({
    userId: req.userId,
  });

  res.status(200).json({
    message:"Goals Deleted Successfully"
  })
}