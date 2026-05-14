export function PortalFooter() {
  return (
    <footer className="portal-foot-wrap">
      <div className="portal-foot">
        <p className="crisis-band" style={{ margin: 0 }}>
          In crisis? Call or text <strong>988</strong> · This portal isn&apos;t monitored for emergencies.
        </p>
        <div>
          <a href="#">HIPAA notice</a> · <a href="#">Privacy</a> · <a href="#">Help</a> ·{" "}
          <a href="/login">Sign out</a>
        </div>
      </div>
    </footer>
  );
}
