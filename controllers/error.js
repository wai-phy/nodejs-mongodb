exports.get404Page = (req, res) => {
    res.status(404).render("errors/notFound", { title: "Page Not Found" });
  }

exports.get500Page = (err, req, res, next)=>{
    res.status(500).render("errors/500error",{title: "Something Wrong!"})
}