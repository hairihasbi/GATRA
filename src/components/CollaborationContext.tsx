import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  collection, 
  addDoc 
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db, initAnonymousAuth, handleFirestoreError, OperationType } from '../lib/firebase';
import { TransformationParams } from '../types';

interface LabState {
  params: TransformationParams;
  sceneId: string;
}

interface CollabContextType {
  sessionId: string | null;
  role: 'host' | 'student' | null;
  isCollabActive: boolean;
  participants: any[];
  roomCode: string | null;
  createSession: (labState: LabState) => Promise<void>;
  joinSession: (code: string) => Promise<void>;
  leaveSession: () => void;
  updateGlobalState: (labState: Partial<LabState>) => Promise<void>;
  remoteLabState: LabState | null;
}

const CollabContext = createContext<CollabContextType | null>(null);

export const CollabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [role, setRole] = useState<'host' | 'student' | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [remoteLabState, setRemoteLabState] = useState<LabState | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  // Listen to session changes
  useEffect(() => {
    if (!sessionId) return;

    const sessionRef = doc(db, 'sessions', sessionId);
    const unsubSession = onSnapshot(sessionRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setRemoteLabState(data.labState);
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, `sessions/${sessionId}`));

    const participantsRef = collection(db, 'sessions', sessionId, 'participants');
    const unsubParticipants = onSnapshot(participantsRef, (snap) => {
      setParticipants(snap.docs.map(d => d.data()));
    }, (err) => handleFirestoreError(err, OperationType.LIST, `sessions/${sessionId}/participants`));

    return () => {
      unsubSession();
      unsubParticipants();
    };
  }, [sessionId]);

  const createSession = async (labState: LabState) => {
    try {
      const u = await initAnonymousAuth();
      const sessionRef = await addDoc(collection(db, 'sessions'), {
        hostId: u.uid,
        activeLab: labState.sceneId,
        labState,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Add host as participant
      await setDoc(doc(db, 'sessions', sessionRef.id, 'participants', u.uid), {
        uid: u.uid,
        name: `Host (${u.uid.slice(0, 4)})`,
        role: 'host',
        joinedAt: serverTimestamp()
      });

      setSessionId(sessionRef.id);
      setRole('host');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'sessions');
    }
  };

  const joinSession = async (code: string) => {
    try {
      const u = await initAnonymousAuth();
      const sessionRef = doc(db, 'sessions', code);
      
      // Add student participant
      await setDoc(doc(db, 'sessions', code, 'participants', u.uid), {
        uid: u.uid,
        name: `Siswa (${u.uid.slice(0, 4)})`,
        role: 'student',
        joinedAt: serverTimestamp()
      });

      setSessionId(code);
      setRole('student');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `sessions/${code}/participants`);
    }
  };

  const leaveSession = () => {
    setSessionId(null);
    setRole(null);
    setRemoteLabState(null);
  };

  const updateGlobalState = async (updates: Partial<LabState>) => {
    if (!sessionId || role !== 'host') return;

    try {
      const sessionRef = doc(db, 'sessions', sessionId);
      await updateDoc(sessionRef, {
        ...(updates.sceneId && { activeLab: updates.sceneId }),
        ...(updates.params && { 'labState.params': updates.params }),
        'labState.sceneId': updates.sceneId || remoteLabState?.sceneId,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `sessions/${sessionId}`);
    }
  };

  return (
    <CollabContext.Provider value={{
      sessionId,
      role,
      isCollabActive: !!sessionId,
      participants,
      roomCode: sessionId,
      createSession,
      joinSession,
      leaveSession,
      updateGlobalState,
      remoteLabState
    }}>
      {children}
    </CollabContext.Provider>
  );
};

export const useCollab = () => {
  const context = useContext(CollabContext);
  if (!context) throw new Error('useCollab must be used within CollabProvider');
  return context;
};
