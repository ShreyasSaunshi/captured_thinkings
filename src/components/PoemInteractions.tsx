import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Move, PenTool, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePoems } from '../context/PoemContext';
import Button from './ui/Button';
import Input from './ui/Input';

interface PoemInteractionsProps {
  poemId: string;
  likes: number;
  hasLiked: boolean;
  comments: Array<{
    id: string;
    content: string;
    userId: string;
    createdAt: string;
  }>;
}

const PoemInteractions: React.FC<PoemInteractionsProps> = ({
  poemId,
  likes,
  hasLiked,
  comments,
}) => {
  const { session } = useAuth();
  const { toggleLike, addComment } = usePoems();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPraiseAnimation, setShowPraiseAnimation] = useState(false);

  const handleLike = async () => {
    if (!session) {
      alert('Please sign in to whisper praise');
      return;
    }

    setShowPraiseAnimation(true);
    setTimeout(() => setShowPraiseAnimation(false), 1000);
    
    await toggleLike(poemId);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/poem/${poemId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Share Poem',
          url: url
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      alert('Please sign in to pen a reply');
      return;
    }
    
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addComment(poemId, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="border-t border-gray-200 mt-8 pt-6">
      <div className="flex items-center space-x-6">
        <button
          onClick={handleLike}
          className={`relative flex items-center space-x-2 ${
            hasLiked ? 'text-blue-900' : 'text-gray-500 hover:text-blue-900'
          } transition-colors duration-200`}
        >
          <AnimatePresence>
            {showPraiseAnimation && (
              <motion.div
                initial={{ scale: 1, y: 0, opacity: 1 }}
                animate={{ scale: 2, y: -20, opacity: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute -top-2 left-0"
              >
                <Move size={20} className="text-blue-900" />
              </motion.div>
            )}
          </AnimatePresence>
          <Move
            size={20}
            className={`transform transition-transform duration-200 ${
              hasLiked ? 'scale-110' : 'scale-100'
            }`}
          />
          <span className="font-serif">{likes} Whispers</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-900 transition-colors duration-200"
        >
          <PenTool size={20} />
          <span className="font-serif">{comments.length} Replies</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-900 transition-colors duration-200"
        >
          <Share2 size={20} />
          <span className="font-serif">Share</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-6">
          <h3 className="font-serif text-lg text-gray-900 mb-4">✍️ Pen a Reply</h3>
          
          {session && (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                fullWidth
              />
              <div className="mt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                  disabled={isSubmitting || !newComment.trim()}
                >
                  Send Reply
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-gray-800 font-serif">{comment.content}</p>
                <p className="text-sm text-gray-500 mt-2 font-serif">
                  Penned on {formatDate(comment.createdAt)}
                </p>
              </div>
            ))}
            
            {comments.length === 0 && (
              <p className="text-gray-500 text-center py-4 font-serif italic">
                No replies yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PoemInteractions;