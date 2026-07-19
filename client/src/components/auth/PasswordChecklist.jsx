import React from "react";
import { FiCheck, FiCircle } from "react-icons/fi";

import { getPasswordChecklist } from "../../utils/passwordRules";

const PasswordChecklist = ({ password }) => {
  const checklist = getPasswordChecklist(password);

  return (
    <ul className="auth-password-checklist">
      {checklist.map((rule) => (
        <li
          key={rule.label}
          className={rule.met ? "auth-password-checklist__item--met" : ""}
        >
          {rule.met ? <FiCheck /> : <FiCircle />}
          {rule.label}
        </li>
      ))}
    </ul>
  );
};

export default PasswordChecklist;
