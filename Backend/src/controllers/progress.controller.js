import progressModel from "../models/progress.model.js";
import userModel from "../models/user.model.js";

export async function addManually(req, res) {
  
  const { subject, topic, completedAt } = req.body;

  if (!subject || !topic) {
    return res.status(400).json({ message: "Subject and topic are required" });
  }

  const progress = await progressModel.findOneAndUpdate(
      {
        userId: req.userId,
        subject: subject.toUpperCase(),
        topic,
      },
      {
        $set: {
          completionType: "manual",
          completedAt: completedAt || new Date(),
        },
      },
      { upsert: true, new: true }
    );

  res.status(200).json({
    message: "Progress Recorded Successfully",
    progress,
  });
}

// export async function takeAiTest(req,res) {
  
// }

export async function deleteProgress(req, res) {

  const { progressId } = req.params;

  if (!progressId) {
    return res.status(400).json({
      success: false,
      message: "Progress ID is required",
    });
  }

  const progress = await progressModel.findOneAndDelete({
    _id: progressId,
    userId: req.userId,
  });

  if (!progress) {
    return res.status(404).json({
      message: "Progress Not Found",
    });
  }

  res.status(200).json({
    message: "Progress Deleted Successfully",
  });
}

export async function deleteSubjectProgress(req, res) {

  const { subject } = req.params; // subject url ki prop h, means vo 100% aaega hi aaega

  await progressModel.deleteMany({
    userId: req.userId,
    subject: subject.toUpperCase(),
  });

  res.status(200).json({
    message: "Subject Progress Deleted Successfully",
  });
}

export async function getSubjectProgress(req, res) {
  // progress of any one subject

  const { subject } = req.params;

  if (!subject) {
    return res.status(400).json({
      message: "Subject is required",
    });
  }

  const progressList = await progressModel
    .find({
      userId: req.userId,
      subject: subject.toUpperCase(),
    })
    .select("topic completionType aiTestScore completedAt");

  return res.status(200).json({
    message: "Progress Fetched Successfully",
    subject: subject.toUpperCase(),
    completedCount: progressList.length,
    topics: progressList,
  });
}

export async function getAllProgress(req, res) {

  const progressList = await progressModel
    .find({ userId: req.userId })
    .select("subject topic completionType aiTestScore completedAt");

  // Group All progress by subject
  const groupedProgress = progressList.reduce((acc, item) => {
    const subj = item.subject;
    if (!acc[subj]) {
      acc[subj] = {
        completedCount: 0,
        topics: [],
      };
    }
    acc[subj].completedCount += 1;
    acc[subj].topics.push(item);
    return acc;
  }, {});

  return res.status(200).json({
    success: true,
    message: "Progress Fetched Successfully",
    totalCompletedTopics: progressList.length,
    data: groupedProgress,
  });
}

export async function getProgressSummary(req, res) {

  const summary = await progressModel.aggregate([
    {
      $match: { userId: user._id },
    },
    {
      $group: {
        _id: "$subject",
        totalCompleted: { $sum: 1 },
        manualCount: {
          $sum: { $cond: [{ $eq: ["$completionType", "manual"] }, 1, 0] },
        },
        aiTestCount: {
          $sum: { $cond: [{ $eq: ["$completionType", "Ai_Test"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        subject: "$_id",
        totalCompleted: 1,
        manualCount: 1,
        aiTestCount: 1,
      },
    },
  ]);

  const grandTotal = summary.reduce(
    (acc, curr) => acc + curr.totalCompleted,
    0,
  );

  return res.status(200).json({
    success: true,
    message: "Progress Summary Fetched Successfully",
    grandTotalCompleted: grandTotal,
    subjectsCount: summary.length,
    summary,
  });
}

export async function deleteAllProgress(req, res) {

  await progressModel.deleteMany({
    userId: req.userId,
  });

  res.status(200).json({
    message: "All Progress Deleted Successfully",
  });
}

// ai assistant api