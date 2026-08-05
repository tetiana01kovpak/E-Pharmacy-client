import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="container" style={{ paddingBlock: '4rem', textAlign: 'center' }}>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/home">Back to home</Link>
    </div>
  );
}
