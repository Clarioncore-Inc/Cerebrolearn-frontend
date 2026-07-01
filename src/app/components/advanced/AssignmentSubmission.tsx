import React, { useState } from 'react';
import { Upload, FileText, X, Check, Clock, AlertCircle, Download, MessageSquare } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AssignmentSubmissionProps {
  assignmentId: string;
  assignmentTitle: string;
  dueDate: string;
  maxScore: number;
  instructions: string;
}

export function AssignmentSubmission({
  assignmentId,
  assignmentTitle,
  dueDate,
  maxScore,
  instructions
}: AssignmentSubmissionProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock submission data
  const submissionStatus = {
    submitted: isSubmitted,
    submittedAt: '2024-12-01 10:30 AM',
    grade: 85,
    feedback: 'Great work! Your understanding of the concepts is clear. Consider adding more examples in the future.',
    gradedAt: '2024-12-02 02:15 PM',
    gradedBy: 'Dr. Sarah Johnson'
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) added`);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  const handleSubmit = () => {
    if (files.length === 0 && !submissionText.trim()) {
      toast.error('Please add files or text before submitting');
      return;
    }
    setIsSubmitted(true);
    toast.success('Assignment submitted successfully!');
  };

  const isDueDatePassed = new Date(dueDate) < new Date();
  const daysUntilDue = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{assignmentTitle}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                Due: {dueDate}
              </span>
              <span className="text-gray-600">Max Score: {maxScore} points</span>
            </div>
          </div>
          {!isSubmitted && (
            <div className={`px-4 py-2 rounded-lg ${
              isDueDatePassed 
                ? 'bg-red-100 text-red-700' 
                : daysUntilDue <= 2 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-green-100 text-green-700'
            }`}>
              {isDueDatePassed 
                ? 'Overdue' 
                : daysUntilDue <= 2 
                  ? `Due in ${daysUntilDue} days` 
                  : 'On time'}
            </div>
          )}
          {isSubmitted && (
            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
              Submitted
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
          <p className="text-gray-700 whitespace-pre-line">{instructions}</p>
        </div>
      </div>

      {/* Submission Status */}
      {isSubmitted && submissionStatus.grade && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Your Grade</h2>
              <p className="text-sm text-gray-600">Graded by {submissionStatus.gradedBy}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-600 mb-1">
                {submissionStatus.grade}/{maxScore}
              </div>
              <p className="text-sm text-gray-600">{Math.round((submissionStatus.grade / maxScore) * 100)}%</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900 mb-1">Instructor Feedback</h3>
                <p className="text-green-800">{submissionStatus.feedback}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submission Form */}
      {!isSubmitted && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Your Submission</h2>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload Files (PDF, DOC, ZIP, etc.)
            </label>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#395192] transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-700 mb-1">
                  <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX, ZIP (max 50MB)</p>
              </label>
            </div>

            {/* Uploaded Files */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Text Submission */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Written Response (Optional)
            </label>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              rows={8}
              placeholder="Type your response here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              {submissionText.length} characters
            </p>
          </div>

          {/* Warning for Late Submission */}
          {isDueDatePassed && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-900 mb-1">Late Submission</h3>
                  <p className="text-sm text-yellow-800">
                    This assignment is past the due date. Late submissions may receive a grade penalty.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Submit Assignment
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Save Draft
            </button>
          </div>
        </div>
      )}

      {/* View Submitted Work */}
      {isSubmitted && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Your Submission</h2>
            <span className="text-sm text-gray-600">
              Submitted on {submissionStatus.submittedAt}
            </span>
          </div>

          {/* Submitted Files */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Files</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-900">{file.name}</span>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-primary hover:bg-accent rounded">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted Text */}
          {submissionText && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Written Response</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{submissionText}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}