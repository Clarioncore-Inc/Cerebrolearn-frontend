import React, { useState } from 'react';
import { Users, Star, ThumbsUp, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PeerReviewProps {
  assignmentId: string;
  studentId: string;
}

export function PeerReview({ assignmentId, studentId }: PeerReviewProps) {
  const [activeTab, setActiveTab] = useState<'review' | 'received'>('review');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const submissionsToReview = [
    {
      id: '1',
      studentName: 'Anonymous Student A',
      submittedAt: '2024-12-01',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Detailed analysis of the topic with supporting evidence...',
      status: 'pending'
    },
    {
      id: '2',
      studentName: 'Anonymous Student B',
      submittedAt: '2024-12-01',
      content: 'Comprehensive research on the subject matter with multiple perspectives and citations...',
      status: 'pending'
    }
  ];

  const receivedReviews = [
    {
      id: '1',
      reviewer: 'Anonymous Peer 1',
      rating: 4,
      feedback: 'Well researched and structured. Good use of examples. Could improve on conclusion.',
      reviewedAt: '2024-12-02'
    },
    {
      id: '2',
      reviewer: 'Anonymous Peer 2',
      rating: 5,
      feedback: 'Excellent work! Clear arguments and strong evidence. Very comprehensive.',
      reviewedAt: '2024-12-02'
    }
  ];

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!feedback.trim()) {
      toast.error('Please provide feedback');
      return;
    }
    toast.success('Review submitted successfully!');
    setRating(0);
    setFeedback('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Peer Review</h1>
            <p className="text-gray-600">Review your peers and receive feedback</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-blue-600 text-sm mb-1">To Review</p>
            <p className="text-2xl font-bold text-blue-900">2</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-green-600 text-sm mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-900">3</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-purple-600 text-sm mb-1">Avg Rating</p>
            <p className="text-2xl font-bold text-purple-900">4.5 ⭐</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('review')}
          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'review'
              ? 'bg-[#395192] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Review Others ({submissionsToReview.length})
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'received'
              ? 'bg-[#395192] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Reviews Received ({receivedReviews.length})
        </button>
      </div>

      {/* Review Others Tab */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          {submissionsToReview.map((submission) => (
            <div key={submission.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{submission.studentName}</h3>
                  <p className="text-sm text-gray-600">Submitted {submission.submittedAt}</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                  Pending Review
                </span>
              </div>

              {/* Submission Content */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">{submission.content}</p>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  placeholder="Provide constructive feedback..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={handleSubmitReview}
                className="w-full py-3 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors font-medium"
              >
                Submit Review
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Reviews Received Tab */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{review.reviewer}</h3>
                  <p className="text-sm text-gray-600">Reviewed {review.reviewedAt}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">{review.feedback}</p>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <ThumbsUp className="w-4 h-4" />
                  Helpful
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <MessageCircle className="w-4 h-4" />
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
