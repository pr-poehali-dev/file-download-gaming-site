import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { authService, commentsService, Comment } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface CommentsSectionProps {
  fileId: number;
  onLoginRequired: () => void;
}

export default function CommentsSection({ fileId, onLoginRequired }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const user = authService.getUser();

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await commentsService.getComments(fileId);
      setComments(data);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [fileId]);

  const handleSubmit = async () => {
    if (!authService.isAuthenticated()) {
      onLoginRequired();
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Напишите комментарий',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await commentsService.createComment(fileId, newComment, rating || undefined);
      toast({
        title: 'Комментарий добавлен',
        description: 'Спасибо за ваш отзыв!',
      });
      setNewComment('');
      setRating(0);
      loadComments();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await commentsService.deleteComment(commentId);
      toast({
        title: 'Комментарий удалён',
      });
      loadComments();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary">Комментарии</h3>

      <div className="space-y-4 bg-card p-6 rounded-lg border neon-border">
        <div className="space-y-3">
          <Textarea
            placeholder={user ? 'Поделитесь своим мнением...' : 'Войдите, чтобы оставить комментарий'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user}
            rows={4}
          />

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  disabled={!user}
                  className={`transition-colors ${!user ? 'opacity-50' : ''}`}
                >
                  <Icon
                    name="Star"
                    size={24}
                    className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
                  />
                </button>
              ))}
            </div>

            <Button onClick={handleSubmit} disabled={!user || submitting}>
              {submitting ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" className="mr-2" size={16} />
                  Отправить
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <Icon name="Loader2" className="animate-spin mx-auto" size={32} />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Комментариев пока нет. Будьте первым!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-card p-4 rounded-lg border neon-border-secondary">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{comment.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>

                {user && user.id === comment.user_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                )}
              </div>

              {comment.rating && (
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name="Star"
                      size={16}
                      className={star <= comment.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
                    />
                  ))}
                </div>
              )}

              <p className="text-sm">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
