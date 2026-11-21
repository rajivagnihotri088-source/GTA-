
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8000

class GameServer(SimpleHTTPRequestHandler):
    def do_GET(self):
        print("Game request:", self.path)
        return super().do_GET()

server = HTTPServer(("0.0.0.0", PORT), GameServer)

print("🎮 GTA 3D GAME SERVER STARTED!")
print("Open: http://localhost:8000")

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("Game server stopped!")
    server.server_close()
