import next from 'next';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { parseCookie } from 'cookie';
import { decode } from 'next-auth/jwt';
import Doc from '@/server/models/Document';
import OrgMember from '@/server/models/OrgMember';
import connectDB from './server/db/mongoose';

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    const httpServer = createServer(server);
    const authSecret = process.env.NEXTAUTH_SECRET;
    if (!authSecret) {
      throw new Error('NEXTAUTH_SECRET is not defined');
    }
    const io = new Server(httpServer);
    server.all('/*splat', (req, res) => {
      handle(req, res);
    });
    httpServer.listen(3000, () => {
      console.log('server running on port 3000');
    });
    io.use(async (socket, done) => {
      const cookies = parseCookie(socket.handshake.headers.cookie || '');
      const sessionToken = cookies['authjs.session-token'];
      if (!sessionToken) {
        return done(new Error('Unauthorized'));
      }
      try {
        const token = await decode({
          token: sessionToken,
          secret: authSecret,
          salt: 'authjs.session-token',
        });
        if (!token || !token.sub) {
          return done(new Error('invalid token'));
        }
        socket.data.socketAuthId = token.sub;
        done();
      } catch {
        return done(new Error('try again'));
      }
    });
    io.on('connection', (socket) => {
      console.log('new user connected', socket.id);
      socket.on('join-document', async (documentId) => {
        await connectDB();
        const currentDoc = await Doc.findOne({ _id: documentId });
        if (!currentDoc) {
          console.log('document does not exists');
          return;
        }
        const isMember = await OrgMember.findOne({
          orgId: currentDoc.orgId,
          userId: socket.data.socketAuthId,
        });
        if (!isMember) {
          console.log('not member of this organization');
          return;
        }
        socket.join(documentId);
        socket.data.documentId = documentId;
        console.log('joined room', documentId);
      });
      socket.on('content-change', (data) => {
        socket.to(socket.data.documentId).emit('content-change', data);
      });
    });
  })
  .catch((error) => {
    console.log('Something went wrong', error);
  });
