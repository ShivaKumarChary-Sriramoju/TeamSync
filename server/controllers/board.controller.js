import Board from '../models/Board.js';
import { createBoardSchema } from '../validators/board.validator.js';

export const listBoards = async (req, res) => {
  const boards = await Board.find({ workspaceId: req.params.id });
  res.json(boards);
};

export const createBoard = async (req, res) => {
  try {
    const { title } = createBoardSchema.parse(req.body);
    const columns = [
      { id: 'todo', name: 'To Do', order: 0 },
      { id: 'inprogress', name: 'In Progress', order: 1 },
      { id: 'done', name: 'Done', order: 2 }
    ];
    const board = await Board.create({ workspaceId: req.params.id, title, columns });
    res.status(201).json(board);
  } catch (err) { res.status(400).json({ message: 'Invalid data' }); }
};

export const deleteBoard = async (req, res) => {
  await Board.findOneAndDelete({ _id: req.params.boardId, workspaceId: req.params.id });
  res.json({ message: 'Board deleted' });
};
