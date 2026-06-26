function toSafeUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
  };
}

module.exports = {
  toSafeUser,
};