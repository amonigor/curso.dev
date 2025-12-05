async function nodeenv(request, response) {
  response.status(200).json({
    nodeenv: process.env.NODE_ENV,
  });
}

export default nodeenv;
