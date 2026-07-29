# Privacy-safe front-end events

MoveIn dispatches browser-local `movein:analytics` custom events. No vendor, measurement ID, network request, ZIP value, address, email, account number, or payment data is hardcoded.

Prepared events cover ZIP submission and outcome, supported/partial/unsupported result state, homeowner and renter hub visits, coverage visit and link, provider official/start/outage actions, provider category, phone, official source, related guide, correction link/submission, FAQ interaction, and print action. ZIP forms add only a placement context such as `homepage_hero`, `homepage_footer`, `unsupported_zip`, or `inline`.

Any future analytics adapter must listen for the custom event, document retention and consent behavior, and preserve this allowlist instead of serializing form fields or page text.
