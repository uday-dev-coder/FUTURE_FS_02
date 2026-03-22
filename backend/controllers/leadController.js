const Lead = require('../models/Lead');

// GET all leads with search & filter
exports.getLeads = async (req, res) => {
  try {
    const { search, status, projectType } = req.query;
    let query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
    if (status) query.status = status;
    if (projectType) query.projectType = projectType;
    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single lead
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create lead
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT update lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST add note
exports.addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    lead.notes.push({ text: req.body.text });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET analytics
exports.getAnalytics = async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const byStatus = await Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const byProject = await Lead.aggregate([{ $group: { _id: '$projectType', count: { $sum: 1 } } }]);
    const bySource = await Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]);
    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5);
    res.json({ total, byStatus, byProject, bySource, recentLeads });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
