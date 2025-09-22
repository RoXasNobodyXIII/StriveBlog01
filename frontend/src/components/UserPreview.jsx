import React from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function UserPreview({ profile }) {
  const avatarUrl = profile.avatar || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";
  const fullName = `${profile.nome} ${profile.cognome}`;

  return (
    <Card className="mb-4 shadow-sm border-0 h-100" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '15px',
      overflow: 'hidden',
      transition: 'transform 0.2s ease-in-out',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <Card.Body className="text-center d-flex flex-column" style={{ padding: '25px 15px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          overflow: 'hidden',
          margin: '0 auto 15px',
          border: '3px solid #007bff',
          boxShadow: '0 4px 8px rgba(0,123,255,0.2)'
        }}>
          <Image
            src={avatarUrl}
            alt="Author avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <Card.Title style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#2c3e50',
          marginBottom: '15px',
          lineHeight: '1.3'
        }}>
          {fullName}
        </Card.Title>
        <Link to={`/authors/${profile._id}`} style={{ textDecoration: 'none', marginTop: 'auto' }}>
          <Button
            variant="primary"
            style={{
              background: 'linear-gradient(45deg, #28a745, #20c997)',
              border: 'none',
              borderRadius: '25px',
              padding: '8px 20px',
              fontWeight: '500',
              fontSize: '0.9rem',
              boxShadow: '0 2px 4px rgba(40,167,69,0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 4px 8px rgba(40,167,69,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 4px rgba(40,167,69,0.3)';
            }}
          >
            View Profile 👤
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default UserPreview;
