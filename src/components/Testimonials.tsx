import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  investor: string;
  message: string;
  rating: number; // out of 5
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 't1',
    investor: 'Jenny R.',
    message: 'Fast and reliable withdrawal! Got my payout within 24 hours. Highly recommend.',
    rating: 5,
    date: '2024-07-18'
  },
  {
    id: 't2',
    investor: 'Mark D.',
    message: 'Smooth process and excellent support. Feeling confident with this trading wallet.',
    rating: 5,
    date: '2024-07-15'
  },
  {
    id: 't3',
    investor: 'Alvin K.',
    message: 'Love the transparency and quick updates on my transactions. Great platform!',
    rating: 4,
    date: '2024-07-12'
  }
];

const Testimonials = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h3 className="text-2xl font-semibold mb-6 text-center">What Our Investors Say</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map(({ id, investor, message, rating, date }) => (
          <Card key={id} className="p-4 bg-white shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{investor}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-700">"{message}"</p>
              <div className="flex items-center">
                {Array.from({ length: rating }).map((_, idx) => (
                  <Star key={idx} className="text-yellow-400 h-5 w-5" />
                ))}
                {Array.from({ length: 5 - rating }).map((_, idx) => (
                  <Star key={idx} className="text-gray-300 h-5 w-5" />
                ))}
                <span className="ml-auto text-sm text-gray-500">{date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;