import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./AuthProvider";

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string
  }>;
}> // Record é objeto, então a tipagem fica Objeto<chave, valor>


export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    // on: toda vez que o estado de roomRef mudar no firebase, eleirá fazer essa chamanda novamente
    // once: vai ouvir o evento somente uma vez e depois vai parar
    roomRef.on('value', room => {
      const databaseRoom = room.val(); // val(): retorna o valor de room que está no DB

      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      // Object.entries: retorna uma matriz com key/value em cada subarray
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      });
      
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      roomRef.off('value');
    }
  }, [roomId, user]);

  return { questions, title };
}