// AI Chatbot Service - Có thể tích hợp với OpenAI, Gemini, hoặc rule-based
// Hiện tại sử dụng rule-based với pattern matching, có thể nâng cấp lên AI thật sau

const medicalKnowledgeBase = {
    // Triệu chứng thường gặp
    dauDau: {
        patterns: ['đau đầu', 'nhức đầu', 'đau đầu', 'headache'],
        response: 'Đau đầu có thể do nhiều nguyên nhân như căng thẳng, thiếu ngủ, hoặc các vấn đề về mắt. Bạn nên:\n- Nghỉ ngơi đầy đủ\n- Uống đủ nước\n- Tránh căng thẳng\n- Nếu đau kéo dài hoặc nghiêm trọng, nên đến bác sĩ để khám'
    },
    sot: {
        patterns: ['sốt', 'nóng', 'fever'],
        response: 'Sốt là phản ứng tự nhiên của cơ thể khi chống lại nhiễm trùng. Bạn nên:\n- Uống nhiều nước\n- Nghỉ ngơi\n- Dùng thuốc hạ sốt nếu cần (theo chỉ dẫn)\n- Nếu sốt cao trên 39°C hoặc kéo dài, nên đến bác nhân viên y tế'
    },
    ho: {
        patterns: ['ho', 'cough', 'ho khan', 'ho có đờm'],
        response: 'Ho có thể do cảm lạnh, dị ứng, hoặc các vấn đề về hô hấp. Bạn nên:\n- Uống nhiều nước ấm\n- Súc miệng bằng nước muối\n- Tránh khói bụi\n- Nếu ho kéo dài trên 2 tuần, nên đến bác sĩ'
    },
    dauBung: {
        patterns: ['đau bụng', 'đau dạ dày', 'stomach', 'abdominal pain'],
        response: 'Đau bụng có thể do nhiều nguyên nhân. Bạn nên:\n- Nghỉ ngơi\n- Uống nước ấm\n- Tránh thức ăn cay, nóng\n- Nếu đau dữ dội hoặc kéo dài, nên đến bác sĩ ngay'
    },
    matNgu: {
        patterns: ['mất ngủ', 'khó ngủ', 'insomnia', 'ngủ không ngon'],
        response: 'Mất ngủ có thể ảnh hưởng đến sức khỏe. Bạn nên:\n- Tạo thói quen ngủ đúng giờ\n- Tránh caffeine trước khi ngủ\n- Tạo không gian ngủ thoải mái\n- Tập thể dục nhẹ nhàng\n- Nếu vấn đề kéo dài, nên tư vấn bác sĩ'
    },
    chongMat: {
        patterns: ['chóng mặt', 'hoa mắt', 'dizziness', 'choáng váng'],
        response: 'Chóng mặt có thể do thiếu nước, hạ đường huyết, hoặc các vấn đề về tai trong. Bạn nên:\n- Ngồi hoặc nằm xuống\n- Uống nước\n- Nghỉ ngơi\n- Nếu thường xuyên, nên đến bác sĩ để kiểm tra'
    }
};

// Hàm tìm kiếm pattern trong câu hỏi
const findMatchingPattern = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    for (const [key, data] of Object.entries(medicalKnowledgeBase)) {
        for (const pattern of data.patterns) {
            if (lowerQuestion.includes(pattern)) {
                return data.response;
            }
        }
    }
    
    return null;
};

// Hàm tạo câu trả lời AI
export const generateAIResponse = async (cauHoi, khoaId = null) => {
    try {
        // Tìm pattern matching
        const matchedResponse = findMatchingPattern(cauHoi);
        
        if (matchedResponse) {
            return matchedResponse;
        }

        // Nếu không có pattern matching, trả về câu trả lời chung
        // Có thể tích hợp OpenAI API ở đây
        const generalResponse = `Cảm ơn bạn đã đặt câu hỏi về "${cauHoi}". 

Để tư vấn chính xác hơn, tôi khuyên bạn:
- Mô tả chi tiết hơn về triệu chứng
- Cung cấp thông tin về thời gian xuất hiện
- Cho biết các yếu tố liên quan

Nếu vấn đề nghiêm trọng hoặc kéo dài, bạn nên đến bệnh viện để được bác sĩ khám trực tiếp.

Bạn có muốn đặt lịch khám với bác sĩ chuyên khoa không?`;

        return generalResponse;

        // TODO: Tích hợp OpenAI API
        // if (process.env.OPENAI_API_KEY) {
        //     const OpenAI = require('openai');
        //     const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        //     
        //     const completion = await openai.chat.completions.create({
        //         model: "gpt-3.5-turbo",
        //         messages: [
        //             { role: "system", content: "Bạn là một bác sĩ tư vấn y tế chuyên nghiệp. Hãy trả lời câu hỏi một cách ngắn gọn, chính xác và hữu ích." },
        //             { role: "user", content: cauHoi }
        //         ],
        //         max_tokens: 300
        //     });
        //     
        //     return completion.choices[0].message.content;
        // }
    } catch (error) {
        console.error('Error generating AI response:', error);
        return 'Xin lỗi, tôi không thể xử lý câu hỏi này lúc này. Vui lòng thử lại sau hoặc liên hệ trực tiếp với bác sĩ.';
    }
};

