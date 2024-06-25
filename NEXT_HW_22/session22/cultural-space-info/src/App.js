import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const App = () => {
    const [data, setData] = useState([]);
    const [subjectCodes, setSubjectCodes] = useState([]);
    const [entryFreeOptions, setEntryFreeOptions] = useState([]);
    const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
    const [selectedEntryFree, setSelectedEntryFree] = useState('');

    useEffect(() => {
        // JSON 파일을 로드하여 데이터 설정
        axios
            .get('/서울시 문화공간 정보.json')
            .then((response) => {
                const jsonData = response.data.DATA;

                // 중복 없이 주제분류와 무료구분 값 가져오기
                const uniqueSubjectCodes = [...new Set(jsonData.map((item) => item.subjcode))];
                const uniqueEntryFreeOptions = [...new Set(jsonData.map((item) => item.entrfree))];

                setData(jsonData);
                setSubjectCodes(uniqueSubjectCodes);
                setEntryFreeOptions(uniqueEntryFreeOptions);
            })
            .catch((error) => {
                console.error('Error loading data:', error);
            });
    }, []);

    const handleSubjectCodeChange = (event) => {
        setSelectedSubjectCode(event.target.value);
    };

    const handleEntryFreeChange = (event) => {
        setSelectedEntryFree(event.target.value);
    };

    const filteredData = data.filter(
        (item) =>
            (selectedSubjectCode ? item.subjcode === selectedSubjectCode : true) &&
            (selectedEntryFree ? item.entrfree === selectedEntryFree : true)
    );

    const groupedData = [];
    for (let i = 0; i < filteredData.length; i += 2) {
        groupedData.push(filteredData.slice(i, i + 2));
    }

    return (
        <div className="container">
            <h1>서울시 문화공간 정보</h1>
            <div className="filter-section">
                <label>
                    ✨ 주제분류
                    <select value={selectedSubjectCode} onChange={handleSubjectCodeChange}>
                        <option value="">전체</option>
                        {subjectCodes.map((code) => (
                            <option key={code} value={code}>
                                {code}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    💰 관람료 (무료/유료)
                    <select value={selectedEntryFree} onChange={handleEntryFreeChange}>
                        <option value="">전체</option>
                        {entryFreeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="search-results">
                {groupedData.map((group, index) => (
                    <div className="result-row" key={index}>
                        {group.map((item, idx) => (
                            <div className="result-item" key={idx}>
                                <p className="fac-name">❇️ {item.fac_name}</p> {item.addr}
                                <br />
                                {item.entrfree === '유료' && item.entr_fee && item.entr_fee.length > 4 && (
                                    <span>💰 {item.entr_fee}</span>
                                )}
                                <br />
                                {item.closeday && item.closeday.length > 4 && (
                                    <span className="closeday">✖️ {item.closeday}</span>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
