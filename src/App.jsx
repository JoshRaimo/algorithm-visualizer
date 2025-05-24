import React, { useState, useEffect, useRef } from 'react';
import Bar from './components/Bar';
import './App.css';

function App() {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(50);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [algorithmDescription, setAlgorithmDescription] = useState('');

  // Refs for button elements and sorting state
  const generateArrayBtnRef = useRef(null);
  const startSortBtnRef = useRef(null);
  const isSortingRef = useRef(false);
  const isPausedRef = useRef(false);
  const animationSpeedRef = useRef(50);

  // Update refs when state changes
  useEffect(() => {
    isSortingRef.current = isSorting;
  }, [isSorting]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    animationSpeedRef.current = animationSpeed;
  }, [animationSpeed]);

  // Algorithm descriptions
  const algorithmDescriptions = {
    bubbleSort: `
        <p>Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.</p>
        <p>Key characteristics:</p>
        <ul>
            <li>Time Complexity: O(n²) in worst and average cases</li>
            <li>Space Complexity: O(1)</li>
            <li>Stable: Yes</li>
            <li>In-place: Yes</li>
        </ul>
        <p>Visualization: Red bars show elements being compared, green bars show sorted elements.</p>
    `,
    quickSort: `
        <p>Quick Sort is an efficient, in-place sorting algorithm that uses a divide-and-conquer strategy. It picks a 'pivot' element and partitions the array around it.</p>
        <p>Key characteristics:</p>
        <ul>
            <li>Time Complexity: O(n log n) average case, O(n²) worst case</li>
            <li>Space Complexity: O(log n)</li>
            <li>Stable: No</li>
            <li>In-place: Yes</li>
        </ul>
        <p>Visualization: Red bars show elements being compared with the pivot, green bars show sorted elements in their final position.</p>
    `,
    mergeSort: `
        <p>Merge Sort is a divide-and-conquer algorithm that recursively breaks down the array into smaller subarrays until each has only one element, then merges them back together in sorted order.</p>
        <p>Key characteristics:</p>
        <ul>
            <li>Time Complexity: O(n log n)</li>
            <li>Space Complexity: O(n)</li>
            <li>Stable: Yes</li>
            <li>In-place: No</li>
        </ul>
        <p>Visualization: Red bars show elements being compared during merge, green bars show elements in their final position after the final merge.</p>
    `,
    insertionSort: `
        <p>Insertion Sort builds the final sorted array one item at a time. It's much less efficient on large lists than more advanced algorithms.</p>
        <p>Key characteristics:</p>
        <ul>
            <li>Time Complexity: O(n²)</li>
            <li>Space Complexity: O(1)</li>
            <li>Stable: Yes</li>
            <li>In-place: Yes</li>
        </ul>
        <p>Visualization: Red bars show elements being compared, green bars show sorted elements after the algorithm completes.</p>
    `
  };

  // Effects
  useEffect(() => {
    generateNewArray();
  }, [arraySize]); // Regenerate array when size changes

  useEffect(() => {
    setAlgorithmDescription(algorithmDescriptions[algorithm]);
  }, [algorithm]); // Update description when algorithm changes

  // Functions
  const generateNewArray = () => {
    // Stop any ongoing sorting
    setIsSorting(false);
    isSortingRef.current = false;
    setIsPaused(false);
    isPausedRef.current = false;

    const newArray = [];
    const maxHeight = 300;

    for (let i = 0; i < arraySize; i++) {
      const value = Math.floor(Math.random() * maxHeight) + 5;
      newArray.push({ value: value, state: 'unsorted' });
    }
    setArray(newArray);
  };

  const updateArraySize = (event) => {
    setArraySize(parseInt(event.target.value));
  };

  const updateSpeed = (event) => {
    const newSpeed = 101 - parseInt(event.target.value);
    setAnimationSpeed(newSpeed);
    animationSpeedRef.current = newSpeed;
  };

  // Delay function for visualization speed and pausing
  const delay = (ms) => {
    return new Promise(resolve => {
      const checkPause = () => {
        if (!isSortingRef.current) {
          resolve();
          return;
        }
        if (isPausedRef.current) {
          setTimeout(checkPause, 100);
        } else {
          setTimeout(resolve, animationSpeedRef.current);
        }
      };
      checkPause();
    });
  };

  // Sorting Algorithms
  const bubbleSort = async () => {
    let currentArray = [...array];

    try {
      for (let i = 0; i < currentArray.length; i++) {
        for (let j = 0; j < currentArray.length - i - 1; j++) {
          if (!isSortingRef.current) {
            return;
          }

          // Mark elements being compared
          currentArray = currentArray.map((bar, index) => ({
            ...bar,
            state: (index === j || index === j + 1) ? 'comparing' : 
                   (index >= currentArray.length - i) ? 'sorted' : 'unsorted'
          }));
          setArray([...currentArray]);
          await delay(animationSpeed);

          if (!isSortingRef.current) {
            return;
          }

          if (currentArray[j].value > currentArray[j + 1].value) {
            [currentArray[j], currentArray[j + 1]] = [currentArray[j + 1], currentArray[j]];
            setArray([...currentArray]);
            await delay(animationSpeed);
            
            if (!isSortingRef.current) {
              return;
            }
          }

          // Reset comparing state but maintain sorted state
          currentArray = currentArray.map((bar, index) => ({
            ...bar,
            state: (index >= currentArray.length - i) ? 'sorted' : 'unsorted'
          }));
          setArray([...currentArray]);
        }
      }
      
      // Mark all elements as sorted when complete
      if (isSortingRef.current) {
        setArray(prevArray => prevArray.map(bar => ({ ...bar, state: 'sorted' })));
      }
    } catch (error) {
      if (error.message !== 'Sorting interrupted') {
        console.error('Bubble Sort Error:', error);
      }
    }
  };

  const mergeSort = async (currentArray, low, high) => {
    if (!isSortingRef.current) return;
    if (low < high) {
      const mid = Math.floor((low + high) / 2);
      await mergeSort(currentArray, low, mid);
      if (!isSortingRef.current) return;
      await mergeSort(currentArray, mid + 1, high);
      if (!isSortingRef.current) return;
      await merge(currentArray, low, mid, high);
    }

    // Mark all elements as sorted when the entire array is sorted
    if (low === 0 && high === array.length - 1 && isSortingRef.current) {
      setArray(prevArray => prevArray.map(bar => ({ ...bar, state: 'sorted' })));
    }
  };

  const merge = async (currentArray, low, mid, high) => {
    if (!isSortingRef.current) throw new Error('Sorting interrupted');
    const left = currentArray.slice(low, mid + 1);
    const right = currentArray.slice(mid + 1, high + 1);
    let i = 0, j = 0, k = low;

    const isFinalMerge = (low === 0 && high === array.length - 1);

    while (i < left.length && j < right.length) {
      if (!isSortingRef.current) throw new Error('Sorting interrupted');

      setArray(prevArray => prevArray.map((bar, index) => {
        if (index === k) return { ...bar, state: 'comparing' };
        if (index === k - 1 && k >= low) return { ...bar, state: 'unsorted' };
        return bar;
      }));

      await delay(animationSpeed);
      if (!isSortingRef.current) throw new Error('Sorting interrupted');

      if (left[i].value <= right[j].value) {
        currentArray[k] = left[i];
        i++;
      } else {
        currentArray[k] = right[j];
        j++;
      }

      setArray(prevArray => prevArray.map((bar, index) => {
        if (index === k) return { ...currentArray[k], state: isFinalMerge ? 'sorted' : 'unsorted' };
        return bar;
      }));

      await delay(animationSpeed);
      if (!isSortingRef.current) throw new Error('Sorting interrupted');

      k++;
    }

    while (i < left.length) {
      if (!isSortingRef.current) throw new Error('Sorting interrupted');

      currentArray[k] = left[i];
      setArray(prevArray => prevArray.map((bar, index) => {
        if (index === k) return { ...currentArray[k], state: isFinalMerge ? 'sorted' : 'unsorted' };
        return bar;
      }));
      await delay(animationSpeed);
      if (!isSortingRef.current) throw new Error('Sorting interrupted');

      i++;
      k++;
    }

    while (j < right.length) {
      if (!isSortingRef.current) throw new Error('Sorting interrupted');

      currentArray[k] = right[j];
      setArray(prevArray => prevArray.map((bar, index) => {
        if (index === k) return { ...currentArray[k], state: isFinalMerge ? 'sorted' : 'unsorted' };
        return bar;
      }));
      await delay(animationSpeed);
      if (!isSortingRef.current) throw new Error('Sorting interrupted');

      j++;
      k++;
    }
  };

  const insertionSort = async () => {
    if (!isSortingRef.current) return;
    let currentArray = [...array];

    try {
      for (let i = 1; i < currentArray.length; i++) {
        if (!isSortingRef.current) return;

        const key = currentArray[i];
        let j = i - 1;

        currentArray = currentArray.map((bar, index) => {
          if (index === i) return { ...bar, state: 'comparing' };
          return bar;
        });
        setArray([...currentArray]);
        await delay(animationSpeed);
        if (!isSortingRef.current) return;

        while (j >= 0 && currentArray[j].value > key.value) {
          if (!isSortingRef.current) return;

          currentArray = currentArray.map((bar, index) => {
            if (index === j) return { ...bar, state: 'comparing' };
            return bar;
          });
          setArray([...currentArray]);
          await delay(animationSpeed);
          if (!isSortingRef.current) return;

          currentArray[j + 1] = currentArray[j];
          setArray([...currentArray]);
          await delay(animationSpeed);
          if (!isSortingRef.current) return;

          currentArray = currentArray.map((bar, index) => {
            if (index === j) return { ...bar, state: 'unsorted' };
            return bar;
          });
          setArray([...currentArray]);

          j--;
        }

        if (!isSortingRef.current) return;

        currentArray[j + 1] = key;
        setArray([...currentArray]);
        await delay(animationSpeed);
        if (!isSortingRef.current) return;

        currentArray = currentArray.map((bar, index) => {
          if (index === i) return { ...bar, state: 'unsorted' };
          return bar;
        });
        setArray([...currentArray]);
      }

      // Mark all elements as sorted when complete
      if (isSortingRef.current) {
        setArray(prevArray => prevArray.map(bar => ({ ...bar, state: 'sorted' })));
      }
    } catch (error) {
      if (error.message !== 'Sorting interrupted') {
        console.error('Insertion Sort Error:', error);
      }
    }
  };

  const partition = async (low, high) => {
    if (!isSortingRef.current) return -1;

    let currentArray = [...array];
    const pivot = currentArray[high];
    let i = low - 1;

    // Initial state update for pivot and range
    currentArray = currentArray.map((bar, index) => ({
      ...bar,
      state: (index >= low && index <= high) ? (index === high ? 'comparing' : 'unsorted') : bar.state
    }));
    setArray([...currentArray]);
    await delay(animationSpeed);
    if (!isSortingRef.current) return -1;

    for (let j = low; j < high; j++) {
      if (!isSortingRef.current) return -1;

      // Highlight elements being compared (current element and pivot)
      currentArray = currentArray.map((bar, index) => ({
        ...bar,
        state: (index === j || index === high) ? 'comparing' : 
               ((index >= low && index <= high) ? 'unsorted' : bar.state)
      }));
      setArray([...currentArray]);
      await delay(animationSpeed);
      if (!isSortingRef.current) return -1;

      if (currentArray[j].value < pivot.value) {
        i++;
        
        // Swap elements currentArray[i] and currentArray[j]
        const temp = { ...currentArray[i] };
        currentArray[i] = { ...currentArray[j] };
        currentArray[j] = temp;

        // Update array state after swap
        setArray([...currentArray]);
        await delay(animationSpeed);
        if (!isSortingRef.current) return -1;
      }

      // Reset comparing state for current element, keep pivot highlighted
      currentArray = currentArray.map((bar, index) => ({
        ...bar,
        state: index === high ? 'comparing' : 
               ((index >= low && index <= high && index !== i + 1) ? 'unsorted' : bar.state)
      }));
      setArray([...currentArray]);
       // Add a small delay after resetting state
      await delay(animationSpeed / 2);
    }

    if (!isSortingRef.current) return -1;

    // Place pivot in its final position (swap currentArray[i+1] and currentArray[high])
    const temp = { ...currentArray[i + 1] };
    currentArray[i + 1] = { ...currentArray[high] };
    currentArray[high] = temp;

    // Update array state after final pivot placement swap
    setArray([...currentArray]);
    await delay(animationSpeed);
    if (!isSortingRef.current) return -1;

    // Mark pivot (now at i+1) as sorted and reset others in the partition range
     currentArray = currentArray.map((bar, index) => ({
      ...bar,
      state: index === i + 1 ? 'sorted' : 
             ((index >= low && index <= high) ? 'unsorted' : bar.state)
    }));
    setArray([...currentArray]);
    await delay(animationSpeed);

    return i + 1;
  };

  const quickSort = async (low, high) => {
    if (!isSortingRef.current) return;

    if (low < high) {
      const pivotIndex = await partition(low, high);
      if (!isSortingRef.current) return;

      // Recursively sort the two partitions
      await quickSort(low, pivotIndex - 1);
      if (!isSortingRef.current) return;
      await quickSort(pivotIndex + 1, high);
      if (!isSortingRef.current) return;
    }
     // Mark elements as sorted once their recursive calls are complete (base case for single element or fully sorted partition)
     else if (low === high && isSortingRef.current) {
      setArray(prevArray => prevArray.map((bar, index) => ({
        ...bar,
        state: index === low ? 'sorted' : bar.state
      })));
       await delay(animationSpeed);
    }

    // Final pass to mark all as sorted at the very end of the initial call
    if (low === 0 && high === array.length - 1 && isSortingRef.current && array.every(bar => bar.state !== 'unsorted' && bar.state !== 'comparing')) {
         setArray(prevArray => prevArray.map(bar => ({ ...bar, state: 'sorted' })));
    }
  };

  const startSorting = async () => {
    if (isSortingRef.current) return;

    setIsSorting(true);
    isSortingRef.current = true;
    setIsPaused(false);
    isPausedRef.current = false;

    // Reset array state
    setArray(prevArray => prevArray.map(bar => ({ ...bar, state: 'unsorted' })));

    try {
      switch (algorithm) {
        case 'bubbleSort':
          await bubbleSort();
          break;
        case 'quickSort':
          // Create a new array for quick sort to work with
          const newArray = array.map(bar => ({ ...bar }));
          setArray(newArray);
          await quickSort(0, newArray.length - 1);
          break;
        case 'mergeSort':
          await mergeSort([...array], 0, array.length - 1);
          break;
        case 'insertionSort':
          await insertionSort();
          break;
        default:
          break;
      }
    } catch (error) {
      if (error.message !== 'Sorting interrupted') {
        console.error('Sorting process Error:', error);
      }
      setArray(prevArray => prevArray.map(bar => ({ ...bar, state: 'unsorted' })));
    } finally {
      setIsSorting(false);
      isSortingRef.current = false;
      setIsPaused(false);
      isPausedRef.current = false;
    }
  };

  const toggleSorting = () => {
    if (!isSortingRef.current) {
      startSorting();
    } else {
      setIsPaused(!isPaused);
      isPausedRef.current = !isPausedRef.current;
    }
  };

  // Effect to handle button states
  useEffect(() => {
    const startBtn = startSortBtnRef.current;
    const generateBtn = generateArrayBtnRef.current;
    const algorithmSelectElement = document.getElementById('algorithm');
    const arraySizeInputElement = document.getElementById('arraySize');

    if (startBtn && generateBtn && algorithmSelectElement && arraySizeInputElement) {
      if (isSortingRef.current) {
        startBtn.textContent = isPausedRef.current ? 'Resume Sorting' : 'Pause Sorting';
        generateBtn.disabled = false; // Allow generating new array during sorting
        algorithmSelectElement.disabled = true;
        arraySizeInputElement.disabled = true;
      } else {
        const isArraySorted = array.length > 0 && array.every(bar => bar.state === 'sorted');

        if (isArraySorted) {
          startBtn.textContent = 'Sorting Complete';
          startBtn.disabled = true;
        } else {
          startBtn.textContent = 'Start Sorting';
          startBtn.disabled = false;
        }
        generateBtn.disabled = false;
        algorithmSelectElement.disabled = false;
        arraySizeInputElement.disabled = false;
      }
    }
  }, [isSortingRef.current, isPausedRef.current, array]);

  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
    generateNewArray();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800">Algorithm Visualizer</h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label htmlFor="algorithm" className="block text-sm font-medium text-gray-700">Select Algorithm:</label>
              <select 
                id="algorithm" 
                value={algorithm} 
                onChange={handleAlgorithmChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="bubbleSort">Bubble Sort</option>
                <option value="quickSort">Quick Sort</option>
                <option value="mergeSort">Merge Sort</option>
                <option value="insertionSort">Insertion Sort</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="arraySize" className="block text-sm font-medium text-gray-700">Array Size:</label>
              <input 
                type="range" 
                id="arraySize" 
                min="5" 
                max="100" 
                value={arraySize} 
                onChange={updateArraySize}
                className="w-full"
              />
              <span id="arraySizeValue" className="text-sm text-gray-600">{arraySize}</span>
            </div>

            <div className="space-y-2">
              <label htmlFor="speed" className="block text-sm font-medium text-gray-700">Animation Speed:</label>
              <input 
                type="range" 
                id="speed" 
                min="1" 
                max="100" 
                value={101 - animationSpeed} 
                onChange={updateSpeed}
                className="w-full"
              />
              <span id="speedValue" className="text-sm text-gray-600">{101 - animationSpeed}</span>
            </div>

            <div className="flex space-x-4 items-end">
              <button 
                onClick={generateNewArray} 
                ref={generateArrayBtnRef}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Generate New Array
              </button>
              <button 
                onClick={toggleSorting} 
                ref={startSortBtnRef}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Start Sorting
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Description</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: algorithmDescription }}></div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-end h-[400px] gap-1 p-4">
            {array.map((bar, index) => (
              <Bar key={index} height={bar.value} isComparing={bar.state === 'comparing'} isSorted={bar.state === 'sorted'} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 