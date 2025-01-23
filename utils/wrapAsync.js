//ASYNCWRAP FUNCTION TO HANDLE ASYNC ERRORS
module.exports =(fn)=> {
  return (req, res, next) =>{
    fn(req, res, next).catch(next);
  };
}