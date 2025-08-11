import usersData from '../data/users.json';

const verifyPassword = (inputPassword, hashedPassword) => {
  const demoPasswords = {
    '$2a$10$N9qo8uLOickgx2ZMRZoMye': 'admin123',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy': 'student123'
  };

  if (!demoPasswords.hasOwnProperty(hashedPassword)) {
    return false;
  }

  return demoPasswords[hashedPassword] === inputPassword;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.trim().length > 0;
};

export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const user = usersData.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
          reject(new Error('User not found'));
          return;
        }

        if (!verifyPassword(password, user.password)) {
          reject(new Error('Invalid password'));
          return;
        }

        const { password: _, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } catch (error) {
        reject(new Error('Login failed'));
      }
    }, 1000);
  });
};

export const getAllStudents = () => {
  return usersData.filter(user => user.userType === 'student')
    .map(({ password, ...user }) => user);
};

export const getUserById = (id) => {
  const user = usersData.find(u => u.id === id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const searchStudents = (query) => {
  const students = getAllStudents();
  const searchTerm = query.toLowerCase();

  return students.filter(student =>
    student.userName.toLowerCase().includes(searchTerm) ||
    student.subjects.some(subject => subject.toLowerCase().includes(searchTerm))
  );
};
