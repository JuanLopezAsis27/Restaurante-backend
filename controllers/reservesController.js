const Reserve = require("../models/reserves");

const getReserves = async (req, res) => {
  try {
    const reserves = await Reserve.find().populate("user");
    res.json(reserves);
  } catch (error) {
    return res.status(404).json({ message: "Surgio un error y no se pudo encontrar las reservas." });
    
  }
};

const getUserReserves = async (req, res) => {
  try {
    const reserves = await Reserve.find({ user: req.user.id }).populate("user");
    res.json(reserves);
  } catch (error) {
    return res.status(404).json({ message: "Surgio un error y no se pudo encontrar las reservas." });
  }
};

const createReserve = async (req, res) => {
 try {
  const { dia, hora, telefono, cantidadPersonas } = req.body;

  console.log(dia);

  const reserveFound = await Reserve.findOne({ dia:dia,hora:hora,cantidadPersonas:cantidadPersonas });
  
  if (reserveFound) return res.status(400).json(["Ya hay una reserva registrada en este horario"],);

  const newReserve = new Reserve({
    user: req.user.id,
    dia,
    hora,
    telefono,
    cantidadPersonas,
  });

  const savedReserve = await newReserve.save();

  res.json(savedReserve);
  
 } catch (error) {
  return res.status(401).json({ message: "No se pudo realizar la reserva" });
  
 }
};

const getReserve = async (req, res) => {
  try {
    const { id } = req.params;
    const reserve = await Reserve.findById(id).populate("user");
    if (!reserve)
      return res.status(404).json({ message: "Reserva no encontrada" });
    res.json(reserve);
  } catch (error) {
    return res.status(404).json({ message: "Reserva no encontrada" });
  }
};

const updateReserve = async (req, res) => {
  try {
    const { id } = req.params;
    const { dia, hora, cantidadPersonas } = req.body;

    const reserveFoundUser = await Reserve.findOne({_id:id, dia:dia,hora:hora,cantidadPersonas:cantidadPersonas });
  
    if (reserveFoundUser) return res.status(400).json(["No se han notado cambios en tu reserva"],);

    const reserveFound = await Reserve.findOne({ dia:dia,hora:hora,cantidadPersonas:cantidadPersonas });
  
    if (reserveFound) return res.status(400).json(["Ya hay una reserva registrada en este horario"],);

    const reserve = await Reserve.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!reserve) return res.status(404).json({ message: "Reserva no encontrada" });

    res.json(reserve);

  } catch (error) {
    return res.status(404).json({ message: "Reserva no encontrada" });
  }
};

const deleteReserve = async (req, res) => {
  try {
    const { id } = req.params;
    const reserve = await Reserve.findByIdAndDelete(id);
    if (!reserve)
      return res.status(404).json({ message: "Reserva no encontrada" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(404).json({ message: "Reserva no encontrada" });
  }
};

module.exports = {
  getReserves,
  getUserReserves,
  getReserve,
  createReserve,
  updateReserve,
  deleteReserve,
};
