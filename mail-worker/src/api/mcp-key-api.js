import app from '../hono/hono';
import result from '../model/result';
import userContext from '../security/user-context';

// Admin-only retrieval of the MCP bearer key, backing the "copy key"
// button on the logged-in /mcp landing page. The key is never logged
// and never rendered as page text: the frontend copies it straight to
// the clipboard. The public deploy prompt (deploy-prompt.js and
// mcp-deploy-prompt.txt) stays keyless by design.
// Auth: the global security middleware already requires a valid login
// session for this route; this handler additionally requires the session
// user to be the instance admin (env.admin), because the MCP key is
// equivalent to admin access. Any other logged-in user gets 403.
app.get('/mcp/key', async (c) => {
	const user = userContext.getUser(c);
	if (!user || user.email !== c.env.admin) {
		return c.json(result.fail('Forbidden', 403));
	}
	const key = c.env.MCP_AUTH_KEY;
	if (!key) {
		return c.json(result.fail('MCP key not configured', 500));
	}
	return c.json(result.ok({ key }));
});
