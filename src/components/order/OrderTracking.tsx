import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TrackingEvent {
  id: string;
  status: string;
  message: string;
  created_at: string;
}

interface OrderTrackingProps {
  orderId: string;
}

const OrderTracking = ({ orderId }: OrderTrackingProps) => {
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrackingEvents();
  }, [orderId]);

  const fetchTrackingEvents = async () => {
    const { data, error } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching tracking events:', error);
    } else {
      setTrackingEvents(data || []);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'border-yellow-200 bg-yellow-50';
      case 'confirmed':
        return 'border-green-200 bg-green-50';
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      case 'shipped':
        return 'border-blue-200 bg-blue-50';
      case 'delivered':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Order Tracking</h3>
      
      {trackingEvents.length === 0 ? (
        <p className="text-gray-500">No tracking information available yet.</p>
      ) : (
        <div className="space-y-4">
          {trackingEvents.map((event, index) => (
            <div
              key={event.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border ${getStatusColor(event.status)}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(event.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium capitalize">
                    {event.status}
                  </h4>
                  <time className="text-xs text-gray-500">
                    {new Date(event.created_at).toLocaleString()}
                  </time>
                </div>
                {event.message && (
                  <p className="text-sm text-gray-600 mt-1">
                    {event.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;