const express = require('express');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Rate limiting for contact form submissions
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // Limit each IP to 3 contact submissions per 10 minutes
  message: {
    success: false,
    message: 'Too many contact submissions. Please try again in 10 minutes.'
  }
});

// Email configuration
const createEmailTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Use App Password for Gmail
      }
    });
  } else {
    // Generic SMTP configuration
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
};

// Send email notification to gym admin
const sendAdminNotification = async (contactData) => {
  try {
    const transporter = createEmailTransporter();
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rajurapseGym.com';
    const gymEmail = process.env.GYM_EMAIL || 'info@rajurapseGym.com';

    const mailOptions = {
      from: `"Raju Rapse Gym" <${gymEmail}>`,
      to: adminEmail,
      subject: `New ${contactData.messageType === 'membership' ? 'Membership Inquiry' : 'Contact Message'} - ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🏋️ New ${contactData.messageType === 'membership' ? 'Membership Inquiry' : 'Contact Message'}</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="border-left: 4px solid #dc2626; padding-left: 20px; margin-bottom: 25px;">
              <h2 style="color: #333; margin: 0 0 10px 0;">Contact Details</h2>
              <p style="margin: 5px 0; color: #666;"><strong>Name:</strong> ${contactData.name}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> <a href="mailto:${contactData.email}" style="color: #dc2626;">${contactData.email}</a></p>
              ${contactData.phone ? `<p style="margin: 5px 0; color: #666;"><strong>Phone:</strong> <a href="tel:${contactData.phone}" style="color: #dc2626;">${contactData.phone}</a></p>` : ''}
              <p style="margin: 5px 0; color: #666;"><strong>Subject:</strong> ${contactData.subject}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Source:</strong> ${contactData.source.replace('_', ' ').toUpperCase()}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Priority:</strong> <span style="color: ${contactData.priority === 'high' ? '#dc2626' : contactData.priority === 'medium' ? '#f59e0b' : '#10b981'}; font-weight: bold;">${contactData.priority.toUpperCase()}</span></p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin: 0 0 15px 0;">Message:</h3>
              <p style="color: #555; line-height: 1.6; margin: 0; white-space: pre-wrap;">${contactData.message}</p>
            </div>
            
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; color: #991b1b; font-weight: bold;">⚠️ Action Required</p>
              <p style="margin: 5px 0 0 0; color: #7f1d1d;">Please respond to this ${contactData.messageType === 'membership' ? 'membership inquiry' : 'message'} within 24 hours for best customer experience.</p>
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
              <a href="${process.env.ADMIN_PANEL_URL || 'http://localhost:3000/admin/messages'}" 
                 style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                View in Admin Panel →
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 25px; padding-top: 15px; text-align: center; color: #6b7280; font-size: 12px;">
              <p>Received: ${new Date().toLocaleString()}</p>
              <p>Raju Rapse Gym Management System</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email notification failed:', error);
    return false;
  }
};

// Send confirmation email to user
const sendUserConfirmation = async (contactData) => {
  try {
    const transporter = createEmailTransporter();
    
    const gymEmail = process.env.GYM_EMAIL || 'info@rajurapseGym.com';

    const mailOptions = {
      from: `"Raju Rapse Gym" <${gymEmail}>`,
      to: contactData.email,
      subject: `Thank you for contacting Raju Rapse Gym - We'll be in touch soon!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏋️ Raju Rapse Gym</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">Transform Your Body, Elevate Your Mind</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #333; margin: 0;">Thank You, ${contactData.name}! 🙏</h2>
              <p style="color: #666; margin: 10px 0; font-size: 16px;">We've received your ${contactData.messageType === 'membership' ? 'membership inquiry' : 'message'} and appreciate you reaching out.</p>
            </div>
            
            <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
              <h3 style="color: #065f46; margin: 0 0 10px 0;">✅ What happens next?</h3>
              <ul style="color: #047857; margin: 0; padding-left: 20px;">
                <li>Our team will review your ${contactData.messageType === 'membership' ? 'inquiry' : 'message'} within 2-4 hours</li>
                <li>You'll receive a personalized response within 24 hours</li>
                ${contactData.messageType === 'membership' ? '<li>We\'ll schedule a free consultation if you\'re interested</li>' : ''}
                <li>Feel free to call us at <strong>+91 9876543210</strong> for immediate assistance</li>
              </ul>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0;">Your Message Summary:</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Subject:</strong> ${contactData.subject}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Message:</strong></p>
              <p style="color: #555; background: white; padding: 15px; border-radius: 4px; margin: 10px 0; border: 1px solid #e5e7eb;">${contactData.message}</p>
            </div>
            
            ${contactData.messageType === 'membership' ? `
            <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="color: #dc2626; margin: 0 0 15px 0;">🎯 Special Membership Offer</h3>
              <p style="color: #991b1b; margin: 0 0 15px 0;">Get <strong>20% OFF</strong> your first month when you join this week!</p>
              <p style="color: #7f1d1d; margin: 0; font-size: 14px;">*Mention this email when you visit</p>
            </div>
            ` : ''}
            
            <div style="background: #1f2937; padding: 20px; border-radius: 8px; margin: 20px 0; color: white; text-align: center;">
              <h3 style="color: #f3f4f6; margin: 0 0 15px 0;">Visit Us Today!</h3>
              <p style="margin: 5px 0; color: #d1d5db;">📍 123 Fitness Street, Gym City, GC 12345</p>
              <p style="margin: 5px 0; color: #d1d5db;">📞 +91 9876543210</p>
              <p style="margin: 5px 0; color: #d1d5db;">⏰ Mon-Sun: 5:00 AM - 11:00 PM</p>
              <p style="margin: 15px 0 5px 0; color: #d1d5db;">Follow us for fitness tips and updates:</p>
              <div style="margin-top: 10px;">
                <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px;">Facebook</a>
                <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px;">Instagram</a>
                <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px;">Twitter</a>
              </div>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 25px; padding-top: 15px; text-align: center; color: #6b7280; font-size: 12px;">
              <p>This email was sent to ${contactData.email}</p>
              <p>Raju Rapse Gym - Your Fitness Journey Starts Here</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('User confirmation email failed:', error);
    return false;
  }
};

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message, source = 'contact_page', messageType = 'contact' } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields'
      });
    }

    // Get client IP and user agent for tracking
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Determine priority based on message type and keywords
    let priority = 'medium';
    const highPriorityKeywords = ['urgent', 'emergency', 'complaint', 'problem', 'issue', 'cancel', 'refund'];
    const lowPriorityKeywords = ['general', 'info', 'information', 'thanks', 'feedback'];
    
    const messageText = `${subject} ${message}`.toLowerCase();
    
    if (messageType === 'membership' || highPriorityKeywords.some(keyword => messageText.includes(keyword))) {
      priority = 'high';
    } else if (lowPriorityKeywords.some(keyword => messageText.includes(keyword))) {
      priority = 'low';
    }

    // Create contact message
    const contactMessage = new ContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      messageType,
      source,
      priority,
      ipAddress,
      userAgent
    });

    // Save to database
    await contactMessage.save();

    // Send email notifications
    const emailPromises = [];
    
    // Send admin notification
    emailPromises.push(
      sendAdminNotification(contactMessage).then(sent => {
        if (sent) {
          contactMessage.isEmailSent = true;
          contactMessage.emailSentAt = new Date();
          return contactMessage.save();
        }
      })
    );

    // Send user confirmation
    emailPromises.push(sendUserConfirmation(contactMessage));

    // Execute email sending (don't wait for completion to avoid delays)
    Promise.all(emailPromises).catch(error => {
      console.error('Email sending failed:', error);
    });

    // Return success response immediately
    res.status(201).json({
      success: true,
      message: messageType === 'membership' 
        ? 'Thank you for your membership inquiry! Our team will contact you within 24 hours with personalized membership options.'
        : 'Thank you for your message! We will get back to you within 24 hours.',
      data: {
        id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        subject: contactMessage.subject,
        messageType: contactMessage.messageType,
        priority: contactMessage.priority,
        createdAt: contactMessage.createdAt
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again or call us directly.'
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages (Admin only)
// @access  Private
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      messageType, 
      priority,
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (messageType) filter.messageType = messageType;
    if (priority) filter.priority = priority;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [messages, totalMessages] = await Promise.all([
      ContactMessage.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      ContactMessage.countDocuments(filter)
    ]);

    // Get summary statistics
    const [unreadCount, totalToday, priorityStats] = await Promise.all([
      ContactMessage.countDocuments({ status: 'new' }),
      ContactMessage.countDocuments({
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
      }),
      ContactMessage.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
          limit: parseInt(limit)
        },
        statistics: {
          unreadCount,
          totalToday,
          priorityBreakdown: priorityStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
          }, {})
        }
      }
    });

  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    });
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Update message status (Admin only)
// @access  Private
router.put('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    if (!['new', 'read', 'replied', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const updateData = { status };
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (status === 'replied') updateData.repliedAt = new Date();

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: message
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message status'
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact message (Admin only)
// @access  Private
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
});

module.exports = router;