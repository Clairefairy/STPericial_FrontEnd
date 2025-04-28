const Container = ({ children }) => {
  return (
    <main className="flex-1 bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">{children}</div>
    </main>
  );
};

export default Container;
