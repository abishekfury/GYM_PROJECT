const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const totalMembers = await Member.countDocuments();
        const activeMembers = await Member.countDocuments({ isActive: true });
        const expiredMembers = await Member.countDocuments({ expiryDate: { $lt: new Date() } });
        const todayJoined = await Member.countDocuments({
            joinDate: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        });

        const monthlyRevenue = await Member.aggregate([
            {
                $match: {
                    joinDate: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$paidAmount' }
                }
            }
        ]);

        res.json({
            totalMembers,
            activeMembers,
            expiredMembers,
            todayJoined,
            monthlyRevenue: monthlyRevenue[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;