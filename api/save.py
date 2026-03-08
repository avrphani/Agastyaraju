"""
Vercel Serverless Function: POST /save
--------------------------------------
On Vercel the deployment filesystem is read-only, so this endpoint cannot
permanently modify images_data.json.

Workflow for updating the catalogue:
  1. Run server.py locally  →  edit via the Admin Panel  →  Save
  2. Commit the updated images_data.json
  3. Push / redeploy to Vercel  →  the new JSON is served to all visitors
"""
from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            body   = self.rfile.read(length)
            data   = json.loads(body)
        except (ValueError, json.JSONDecodeError) as e:
            self._respond(400, json.dumps({'error': str(e)}).encode())
            return

        # Vercel's runtime filesystem is read-only; we cannot write back to
        # images_data.json. Return a clear message so the admin panel can
        # surface it to the user.
        response = {
            'ok': False,
            'note': (
                'Live saves are not supported on Vercel. '
                'Edit locally with server.py, then redeploy to publish changes.'
            )
        }
        self._respond(200, json.dumps(response).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def _respond(self, code, body=b''):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        pass  # suppress Vercel function logs noise
