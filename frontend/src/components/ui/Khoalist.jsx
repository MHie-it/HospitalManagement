import React from 'react';
import Khoacard from './Khoacard';
import EmptyState from './EmptyState';

const KhoaList = ({ khoaList = [] }) => {
  if (!khoaList || khoaList.length === 0) {
    return <EmptyState filter="all" />;
  }

  return (
    <div className="space-y-3 mt-5">
      {khoaList.map((khoa, index) => (
        <Khoacard
          key={khoa._id || index}
          khoa={khoa}
          index={index}
        />
      ))}
    </div>
  );
};

export default KhoaList;