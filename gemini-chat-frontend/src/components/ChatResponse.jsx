import React from "react";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ChatResponse = ({ response }) => {
  if (!response) return null;

  return (
    <div className="container my-4">
      <h3 className="mb-3 text-primary">Chat Response</h3>

      {/* Answer Card */}
      <Card className="mb-3 shadow-sm">
        <Card.Header className="bg-light">
          <strong>Answer</strong>
        </Card.Header>
        <Card.Body>
          <Card.Text>{response.answer}</Card.Text>
        </Card.Body>
      </Card>

      {/* Context Used */}
      {response.contextUsed && response.contextUsed.length > 0 && (
        <Card className="shadow-sm">
          <Card.Header className="bg-light">
            <strong>Context Used</strong>
          </Card.Header>
          <Card.Body>
            <ul className="mb-0 ps-3">
              {response.contextUsed.map((ctx, index) => (
                <li key={index}>{ctx}</li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ChatResponse;
