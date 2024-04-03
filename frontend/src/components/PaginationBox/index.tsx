import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';

// currentPage={currentPage}
//           handlePage={handlePage}
//           rowsPerPage={rowsPerPage}
//           dataLength={tokens.length}
export default function PaginationBox({
  currentPage,
  handlePage,
  rowsPerPage,
  dataLength
}: {
  currentPage: number;
  handlePage: (page: number) => void;
  rowsPerPage: number;
  dataLength: number;
}) {
  const pages = new Array(Math.ceil(dataLength / rowsPerPage)).fill(0).map((_, i) => i + 1);
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <div
          className="cursor-pointer inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700"
          onClick={() => handlePage(Math.max(currentPage - 1, 1))}
        >
          <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Previous
        </div>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {pages.map((page) => {
          return (
            <div
              key={page}
              className={`cursor-pointer inline-flex items-center border-t-2 px-4 pt-4 text-sm font-mediumhover:text-gray-700 hover:border-gray-300 ${currentPage === page ? 'border-primary-dark text-primary-dark' : 'border-transparent text-gray-500 dark:text-gray-300'}`}
              onClick={() => handlePage(page)}
            >
              {page}
            </div>
          );
        })}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <div
          className="cursor-pointer inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700"
          onClick={() => handlePage(Math.min(currentPage + 1, pages.length))}
        >
          Next
          <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </nav>
  );
}
