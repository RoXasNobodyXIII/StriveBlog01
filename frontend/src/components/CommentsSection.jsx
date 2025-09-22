import React, { useState, useEffect } from 'react';
import axios from '../../data/axios';
import { Card, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';

function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Funzione per caricare i commenti
  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/blogPosts/${postId}/comments`);
      setComments(response.data.data || []);
    } catch (err) {
      setError('Errore nel caricamento dei commenti');
    } finally {
      setLoading(false);
    }
  };

  // Funzione per aggiungere un commento
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const testAuthorId = '68cae8477b6cdeadecee1202';

      await axios.post(`/blogPosts/${postId}`, {
        author: testAuthorId,
        content: newComment
      });

      setNewComment('');
      await loadComments(); // Ricarica i commenti
    } catch (err) {
      setError('Errore nell\'aggiunta del commento');
    } finally {
      setSubmitting(false);
    }
  };

  // Funzione per eliminare un commento
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo commento?')) return;

    try {
      await axios.delete(`/blogPosts/${postId}/comment/${commentId}`);
      await loadComments(); // Ricarica i commenti
    } catch (err) {
      setError('Errore nell\'eliminazione del commento');
    }
  };

  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId]);

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3 className="comments-title">
          💬 Commenti ({comments.length})
        </h3>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/*commento */}
      <Card className="comment-form-card">
        <Card.Body>
          <Form onSubmit={handleSubmitComment}>
            <Form.Group>
              <Form.Label className="form-label-custom">
                Aggiungi un commento
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Scrivi il tuo commento qui..."
                className="textarea-custom"
                disabled={submitting}
              />
            </Form.Group>
            <Button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="btn-secondary-custom"
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Pubblicando...
                </>
              ) : (
                '💬 Pubblica Commento'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Lista commenti */}
      {loading ? (
        <div className="loading-center">
          <Spinner animation="border" variant="primary" />
          <p>Caricamento commenti...</p>
        </div>
      ) : comments.length === 0 ? (
        <Card className="empty-card">
          <Card.Body className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h5>
              Nessun commento ancora
            </h5>
            <p>
              Sii il primo a commentare questo articolo!
            </p>
          </Card.Body>
        </Card>
      ) : (
        <div>
          {comments.map((comment) => (
            <Card
              key={comment._id}
              className="comment-card"
            >
              <Card.Body>
                <Row>
                  <Col>
                    <div className="comment-meta-container">
                      <div className="comment-avatar">
                        {comment.author.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong className="comment-author-name">
                          {comment.author.nome} {comment.author.cognome}
                        </strong>
                        <div className="comment-meta">
                          {new Date(comment.createdAt).toLocaleDateString('it-IT', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {comment.updatedAt !== comment.createdAt && (
                            <span className="comment-edited">
                              (modificato)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="comment-content">
                      {comment.content}
                    </div>

                    <div className="comment-actions">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteComment(comment._id)}
                        className="btn-danger-custom"
                      >
                        🗑️ Elimina
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentsSection;
