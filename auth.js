async function authenCore(req, res, next, action) {
  const coreUrl = process?.env?.CORE_SERVICE_URI;
  const globalPrefix = process.env.GLOBAL_PREFIX;

  const token = req?.headers?.authorization;
  const route = "geo-view";
  const service = "geo";
  let isPublic = false;
  const publicPool = process?.env?.PUBLIC_PATH?.split(",");
  // console.log(publicPool);

  //   for (const paths of publicPool) {
  //     // console.log(paths)
  //     const target = req.path.replace(`/${globalPrefix}`, "");
  //     // console.log(target,paths,target.startsWith(paths))
  //     if (target.startsWith(paths)) {
  //       isPublic = true;
  //       break;
  //     }
  //   }
  //   if (isPublic) {
  //     next();
  //     return;
  //   }
  if (!token) {
    res.status(401).send({ msg: "Not authenticate" });
    return;
  }
  const permUrl = `${coreUrl}/permission/${service}/${route}`;
  const auth = await fetch(permUrl, {
    headers: { Authorization: token }
  });
  const perm = await auth.json();
  const hasPerm =
    perm?.action_permission?.[service]?.[route]?.[action] ||
    perm?.action_permission?.[service]?.[route]?.["master"];
  if (!hasPerm && !isPublic) {
    res.status(403).send({ msg: "Forbidden" });
    return;
  }
  // console.log('>>',perm)
  req.body = {
    request_by: {
      ...perm.request_by,
      data_permission: perm.data_permission
      // token:headers.authorization
    },
    ...req.body
  };
  next();
}

module.exports = { authenCore };
