import React, { useEffect, useRef, useState } from 'react';

const EidInput = ({
    value = '',
    onChange,
    label = 'Emirates ID',
    id = 'eid-input',
    required = false,
    error = null,
    helperText = 'Format: 784-YYYY-NNNNNNN-N',
    disabled = false,
}) => {
    const segmentLengths = [4, 7, 1];
    const segmentWidths = ['w-16', 'w-24', 'w-10'];
    const [segments, setSegments] = useState(['', '', '']);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (!value) {
            setSegments(['', '', '']);
            return;
        }

        const withoutPrefix = value.startsWith('784-')
            ? value.slice(4)
            : value.startsWith('784')
                ? value.slice(3)
                : value;

        const parts = withoutPrefix.split('-');
        setSegments([
            (parts[0] || '').replace(/[^0-9]/g, '').slice(0, segmentLengths[0]),
            (parts[1] || '').replace(/[^0-9]/g, '').slice(0, segmentLengths[1]),
            (parts[2] || '').replace(/[^0-9]/g, '').slice(0, segmentLengths[2]),
        ]);
    }, [value]);

    const emitValue = (currentSegments) => {
        const normalized = currentSegments.map((segment, idx) =>
            segment.slice(0, segmentLengths[idx])
        );

        if (!normalized.some(Boolean)) {
            onChange?.('');
            return;
        }

        const formatted = ['784', ...normalized].join('-').replace(/-+$/, '');
        onChange?.(formatted);
    };

    const handleInput = (index, event) => {
        const inputValue = event.target.value.replace(/[^0-9]/g, '').slice(0, segmentLengths[index]);
        const nextSegments = [...segments];
        nextSegments[index] = inputValue;
        setSegments(nextSegments);
        if (inputValue.length === segmentLengths[index] && index < nextSegments.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        emitValue(nextSegments);
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !segments[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (event.key === 'ArrowLeft' && index > 0) {
            event.preventDefault();
            inputRefs.current[index - 1]?.focus();
        }
        if (event.key === 'ArrowRight' && index < segments.length - 1) {
            event.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pasted = event.clipboardData.getData('text').replace(/[^0-9]/g, '');
        const withoutPrefix = pasted.startsWith('784') ? pasted.slice(3) : pasted;
        const nextSegments = [
            withoutPrefix.slice(0, 4),
            withoutPrefix.slice(4, 11),
            withoutPrefix.slice(11, 12),
        ];
        setSegments(nextSegments);
        emitValue(nextSegments);
        const focusIndex = nextSegments.findIndex(
            (segment, idx) => segment.length < segmentLengths[idx]
        );
        const targetIndex = focusIndex === -1 ? nextSegments.length - 1 : focusIndex;
        requestAnimationFrame(() => inputRefs.current[targetIndex]?.focus());
    };

    return (
        <div className="eid-input-container">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="flex gap-1 items-center">
                <div className="flex items-center bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600 font-medium">
                    784
                </div>
                <span className="text-gray-400">-</span>
                {segments.map((segment, index) => (
                    <React.Fragment key={index}>
                        <input
                            id={index === 0 ? id : undefined}
                            ref={(element) => (inputRefs.current[index] = element)}
                            type="text"
                            value={segment}
                            maxLength={segmentLengths[index]}
                            placeholder={'0'.repeat(segmentLengths[index])}
                            onChange={(event) => handleInput(index, event)}
                            onKeyDown={(event) => handleKeyDown(index, event)}
                            onPaste={handlePaste}
                            className={`text-center border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'} ${segmentWidths[index]}`}
                            disabled={disabled}
                        />
                        {index < segments.length - 1 && <span className="text-gray-400">-</span>}
                    </React.Fragment>
                ))}
            </div>
            {error ? (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            ) : (
                helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

export default EidInput;
