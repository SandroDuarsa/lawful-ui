#!/usr/bin/env python3
"""Serve the measuring scripts on localhost, and optionally the page you want to test.

Use it when your browser tool accepts only a string of JavaScript and cannot read local files, or when the
thing to test is a file on disk that the browser cannot open directly.

    python3 serve.py                      # scripts only, at http://localhost:8791/
    python3 serve.py --site path/to/dir   # that folder at /, the scripts at /__lawful/
    python3 serve.py --port 9000

Scripts only: open the page under test wherever it lives, then in the page:

    (0, eval)(await (await fetch('http://localhost:8791/ux_probe.js')).text())

With --site: open http://localhost:8791/yourpage.html, then in the page (same origin, so no CORS or CSP trouble):

    (0, eval)(await (await fetch('/__lawful/ux_probe.js')).text())
    (0, eval)(await (await fetch('/__lawful/ux_checks.js')).text())

If the browser refuses "localhost", use "127.0.0.1", and the reverse. The server listens on the local machine
only, is read-only, and sends CORS headers so any page can fetch the scripts. Stop it (Ctrl+C or kill) when
the test is done.
"""
import argparse
import http.server
import pathlib

SCRIPTS = pathlib.Path(__file__).resolve().parent
PREFIX = "/__lawful/"


def make_handler(site):
    class Handler(http.server.SimpleHTTPRequestHandler):
        def translate_path(self, path):
            if path.startswith(PREFIX):
                self.directory = str(SCRIPTS)
                path = "/" + path[len(PREFIX):]
            else:
                self.directory = str(site or SCRIPTS)
            return super().translate_path(path)

        def end_headers(self):
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Private-Network", "true")
            self.send_header("Cache-Control", "no-store")
            super().end_headers()

        def do_OPTIONS(self):
            self.send_response(204)
            self.end_headers()

        def log_message(self, *args):
            pass

    return Handler


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Serve the lawful-ui scripts, and optionally a site folder, on localhost.")
    ap.add_argument("--site", help="folder to serve at / (the scripts then live at /__lawful/)")
    ap.add_argument("--port", type=int, default=8791)
    args = ap.parse_args()
    site = pathlib.Path(args.site).resolve() if args.site else None
    if site and not site.is_dir():
        ap.error(f"not a folder: {site}")
    server = http.server.ThreadingHTTPServer(("127.0.0.1", args.port), make_handler(site))
    where = f"{site} at /, scripts at {PREFIX}" if site else f"scripts from {SCRIPTS}"
    print(f"serving {where} on http://localhost:{args.port}")
    server.serve_forever()
