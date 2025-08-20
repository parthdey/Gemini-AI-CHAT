import React from "react";
import { Accordion, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ChatResponse = ({ response }) => {
  if (!response) return null;

  const { candidates, usageMetadata } = response;

  return (
    <div className="container my-4">
      <h3 className="mb-3 text-primary">Chat Responses</h3>

      {candidates.map((candidate, index) => (
        <Card className="mb-3 shadow-sm" key={index}>
          <Card.Header className="bg-light">
            <strong>Candidate {index + 1}</strong>
          </Card.Header>
          <Card.Body>
            <Card.Text>{candidate.content.parts[0].text}</Card.Text>

            {candidate?.citationMetadata?.citationSources?.length > 0 && (
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Citations</Accordion.Header>
                  <Accordion.Body>
                    <ul className="mb-0 ps-3">
                      {candidate.citationMetadata.citationSources.map((source, idx) => (
                        <li key={idx}>
                          <a
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            {source.uri}
                          </a>{" "}
                          (Indexes: {source.startIndex} - {source.endIndex})
                        </li>
                      ))}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
          </Card.Body>
        </Card>
      ))}

      {usageMetadata && (
        <div className="mt-3 p-3 bg-light rounded shadow-sm">
          <h5 className="mb-2 text-secondary">Usage Metadata</h5>
          <p className="mb-1">
            <strong>Prompt Tokens:</strong> {usageMetadata.promptTokenCount}
          </p>
          <p className="mb-1">
            <strong>Candidate Tokens:</strong> {usageMetadata.candidatesTokenCount}
          </p>
          <p className="mb-0">
            <strong>Total Tokens:</strong> {usageMetadata.totalTokenCount}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatResponse;
