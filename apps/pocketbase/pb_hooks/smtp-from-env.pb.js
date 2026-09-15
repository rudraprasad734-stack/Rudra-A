/// <reference path="../pb_data/types.d.ts" />

// Every login flow in this app depends on a working mailer: citizens sign in
// with a passwordless email OTP, and the President must complete a second
// email-OTP factor even after a correct password. Without an active mail
// transport, PocketBase's request-otp endpoint still reports success to the
// client (by design, to avoid leaking which emails are registered) while no
// usable code is ever delivered — so login silently, permanently fails.
//
// This project no longer runs on Hostinger Horizons (see IAYO_CHANGELOG.md),
// so its BUILDER_MAILER_* relay (builder-mailer.pb.js) is normally
// unconfigured. Configure PocketBase's own built-in SMTP client from
// environment variables instead, applied on every boot so a credential
// rotation only needs an env change + restart, not a new migration.
//
// Required to actually deliver mail: SMTP_HOST, SMTP_SENDER_ADDRESS.
// Optional: SMTP_PORT (default 587), SMTP_USERNAME, SMTP_PASSWORD,
// SMTP_AUTH_METHOD, SMTP_TLS ("false" to disable), SMTP_SENDER_NAME.
onBootstrap((e) => {
  e.next();

  const host = $os.getenv("SMTP_HOST");
  const senderAddress = $os.getenv("SMTP_SENDER_ADDRESS");
  if (!host || !senderAddress) {
    $app.logger().warn(
      "SMTP_HOST/SMTP_SENDER_ADDRESS not set — outgoing mail (OTP codes, security alerts) will fail to send. " +
      "Set them (see apps/pocketbase/pb_hooks/smtp-from-env.pb.js) for citizen/President login to work."
    );
    return;
  }

  try {
    const settings = $app.settings();
    settings.smtp.enabled = true;
    settings.smtp.host = host;
    settings.smtp.port = Number($os.getenv("SMTP_PORT") || "587");
    settings.smtp.username = $os.getenv("SMTP_USERNAME") || "";
    settings.smtp.password = $os.getenv("SMTP_PASSWORD") || "";
    settings.smtp.authMethod = $os.getenv("SMTP_AUTH_METHOD") || "";
    settings.smtp.tls = $os.getenv("SMTP_TLS") !== "false";
    settings.meta.senderAddress = senderAddress;
    settings.meta.senderName = $os.getenv("SMTP_SENDER_NAME") || "IAYO";
    $app.save(settings);
  } catch (err) {
    $app.logger().error("failed to apply SMTP settings from environment", "err", String(err));
  }
});
