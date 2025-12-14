function status(request, response){
  response.status(200).json({
    "Nome": "João"
  })
}

export default status;