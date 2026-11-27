import type { Note } from '../types/note';

export const MESSI_ESSAY_ID = 'note-my-favourite-player';

export const INITIAL_NOTES: Note[] = [
  {
    id: MESSI_ESSAY_ID,
    title: 'My Favourite Player',
    content: [
      'My favourite player is Lionel Messi. He is one of the most famous and talented football players in the world. He was born on 24 June 1987 in Rosario, Argentina. He is an Argentine footballer. He is famous for his excellent football skills, speed, passing and goal-scoring ability. He started playing football when he was a little boy. From his childhood, he dreamed of becoming a great football player.',
      "Messi is one of the greatest footballers in history. He has played for several famous football clubs, such as Barcelona, Paris Saint-Germain and Inter Miami. He has won many awards and trophies in his career. He won the FIFA World Cup with Argentina in 2022. He has also won the Ballon d'Or many times. He is very good at controlling the ball, passing and scoring goals. People love watching him play football.",
      'I like Messi very much because he is talented, hardworking, honest and humble. He always tries his best and never gives up. He teaches us that success comes through hard work, patience and dedication. He is also a great inspiration to young football players.',
      'Messi is not only my favourite player but also my role model. I admire his talent and achievements. I wish him a happy, healthy and successful life. I am very proud to be a fan of Lionel Messi.',
    ].join('\n\n'),
    pinned: true,
    fontStyle: 'serif',
    titleAlign: 'center',
    createdAt: '2026-11-27T13:20:00.000Z',
    updatedAt: '2026-11-27T13:20:00.000Z',
  },
];
