import { divider, mutedText, pageWrapper } from "../styles/common";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      {/* Visual separation from the main content */}
      <div className={pageWrapper}>
        <hr className={divider} />
        <div className="flex flex-col md:flex-row justify-between items-center py-8 gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className={`${mutedText} text-center py-6`}>
              © {new Date().getFullYear()} BlogApp. Built with care.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;