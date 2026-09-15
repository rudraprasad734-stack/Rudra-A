
/// <reference path="../pb_data/types.d.ts" />
// Only Hostinger Horizons deployments have BUILDER_MAILER_API_URL/KEY set.
// Outside that platform (this project's own SMTP, see smtp-from-env.pb.js)
// those env vars are empty, which used to build a relay request to
// "/api/v2/email" (no host) and throw "unsupported protocol scheme". That
// exception aborted every OTP email send - silently breaking citizen OTP
// login and the President's MFA step, since the OTP record request still
// reported success to the client. Fall through to PocketBase's own mailer
// instead of hard-failing when the Hostinger relay isn't configured.
onMailerSend((e) => {
    if (e.app.settings().smtp.enabled) {
        return e.next()
    }

    const apiUrl = $os.getenv("BUILDER_MAILER_API_URL");
    const apiKey = $os.getenv("BUILDER_MAILER_API_KEY");
    const senderAddress = $os.getenv("BUILDER_MAILER_SENDER_ADDRESS");

    if (!apiUrl || !apiKey || !senderAddress) {
        return e.next()
    }

    const payload = {
        "subject": e.message.subject,
        "content": {
            ...(e.message.html ? {
                "html": e.message.html,
            } : {
                "text": e.message.text,
            }),
            "type": "plain",
        },
        "from": senderAddress,
        "fromName": e.message.from?.name,
        "replyTo": senderAddress,
        "to": e.message.to[0].address,
    }

    const response = $http.send({
        url: `${apiUrl}/api/v2/email`,
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    
    if (response.statusCode !== 200) {
        $app.logger().error("Failed to send email", "error", response.json);

        throw new ApiError(500, response.json?.message || 'Failed to send email');
    }
})
