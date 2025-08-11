
import NewsletterSignup from './NewsletterSignup';

const Newsletter = () => {
  return (
    <section className="py-20 bg-rose">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-4xl mb-6 text-burgundy">Join Our Beauty Community</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to receive exclusive offers, beauty tips, and new product announcements.
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
