"""
Local development server for Agastyaraju.
Serves static files AND handles POST /save to write images_data.json.
Run: python server.py
"""
import http.server
import json
import os

PORT = 8080
DIR  = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def do_POST(self):
        if self.path == '/save':
            try:
                length = int(self.headers.get('Content-Length', 0))
                body   = self.rfile.read(length)
                data   = json.loads(body)
            except (ValueError, json.JSONDecodeError) as e:
                self._respond(400, str(e).encode())
                return

            out_path = os.path.join(DIR, 'images_data.json')
            with open(out_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            self._respond(200, b'{"ok":true}')
        else:
            self._respond(404, b'Not found')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def _respond(self, code, body=b''):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        print(f"  {self.address_string()}  {fmt % args}")


if __name__ == '__main__':
    with http.server.HTTPServer(('', PORT), Handler) as httpd:
        print(f"Dev server running at http://localhost:{PORT}")
        print("Press Ctrl+C to stop.\n")
        httpd.serve_forever()
