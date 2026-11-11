#!/usr/bin/env python3
"""Serve this scripts folder on 127.0.0.1 so a page can load the measuring scripts by URL.

Use it when your browser tool accepts only a string of JavaScript and cannot read local files.
Without it you would have to paste a 25 KB script again after every reload.

    python3 serve.py            # http://127.0.0.1:8791
    python3 serve.py 9000       # another port

Then, in the page under test:

    (0, eval)(await (await fetch('http://127.0.0.1:8791/ux_probe.js')).text())
    (0, eval)(await (await fetch('http://127.0.0.1:8791/ux_checks.js')).text())

It binds to localhost only, serves this folder read-only, and sends CORS headers so any page can fetch
the scripts. Stop it (Ctrl+C or kill) when the test is done. A page whose Content-Security-Policy blocks
the fetch needs the paste route instead.
"""
import functools
import http.server
import pathlib
import sys


class Handler(http.server.SimpleHTTPRequestHandler):
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


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8791
    folder = str(pathlib.Path(__file__).resolve().parent)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), functools.partial(Handler, directory=folder))
    print(f"serving {folder} at http://127.0.0.1:{port}")
    server.serve_forever()
