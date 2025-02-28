import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Circle } from 'lucide-react';

const ProcessTracker = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const steps = [
    { 
      id: 1, 
      title: 'Finished', 
      description: 'Description',
      status: 'completed' 
    },
    { 
      id: 2, 
      title: 'In Progress', 
      description: 'Description',
      status: 'current' 
    },
    { 
      id: 3, 
      title: 'Waiting', 
      description: 'Description',
      status: 'waiting' 
    },
    { 
      id: 4, 
      title: 'Editable Titles', 
      description: 'Description Text',
      status: 'editable' 
    },
    { 
      id: 5, 
      title: 'Swap Indicator colors', 
      description: 'Select text or icon for indicator',
      status: 'completed' 
    },
    { 
      id: 6, 
      title: 'Change line color', 
      description: 'Description',
      status: 'current' 
    }
  ];
  
  const getStatusIcon = (status : string) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-white" />;
      case 'current':
        return <Clock className="h-5 w-5 text-white" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getStatusColor = (status : string) => {
    switch(status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      case 'editable':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };
  
  const getLineColor = (index : number, steps : { status: string; }[]) => {
    if (index === 0) return '';
    
    const prevStatus = steps[index-1].status;
    const currentStatus = steps[index].status;
    
    if (prevStatus === 'completed' && (currentStatus === 'completed' || currentStatus === 'current')) {
      return 'bg-blue-500';
    }
    return 'bg-gray-300';
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="relative mt-8 mb-12">
        {/* Main track line */}
        <div className="absolute h-0.5 bg-gray-200 left-0 right-0 top-7"></div>
        
        {/* Completed track portion */}
        <div 
          className="absolute h-0.5 bg-blue-500 left-0 top-7 transition-all duration-1000 ease-in-out"
          style={{ width: isLoaded ? '40%' : '0%' }}
        ></div>
        
        {/* Steps */}
        <div className="flex justify-between relative">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center relative"
              style={{ 
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease-in-out ${index * 0.1}s`
              }}
            >
              {/* Connection line to next step */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute h-0.5 top-7 ${getLineColor(index+1, steps)}`}
                  style={{ 
                    left: '50%', 
                    width: '100%',
                    opacity: isLoaded ? 1 : 0,
                    transition: `opacity 0.5s ease-in-out ${(index + 0.5) * 0.1}s`
                  }}
                ></div>
              )}
              
              {/* Step indicator circle */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center z-10 shadow-md ${getStatusColor(step.status)}`}>
                {step.status === 'editable' ? (
                  <span className="text-white font-bold">{step.id}</span>
                ) : (
                  getStatusIcon(step.status)
                )}
              </div>
              
              {/* Step title */}
              <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
              
              {/* Step description */}
              <p className="text-xs text-gray-500 mt-1 max-w-[120px] text-center">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessTracker;